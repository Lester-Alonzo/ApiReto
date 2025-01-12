import type {Response, NextFunction} from 'express'
import type {Express} from '../types'
import { keyDB } from '../db/keydbConf'
import { sequelize } from '../db/mssql'
import { QueryTypes } from "@sequelize/core"
import {Credentials} from '../lib/zchemas'
import { HassPass } from "../lib/utils/encry"
import { SendEmail } from '../lib/mail'
import {PswUtils} from '../lib/utils/OTPswd'

const pwdUtil = new PswUtils(4, "064c4afb0e964934")

export async function MiddlewareAdmins(
  req: Express.RequestS,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let sessionToken = req.headers["session"] as string
    if (!(await keyDB.exists(sessionToken))) {
      res.status(405).json({ message: "Error con la session" })
    }

    let tokenVal = await keyDB.hgetall(sessionToken)
    console.log(tokenVal)

    if (Number(tokenVal.rol) !== 1 && req.originalUrl.includes("create")) {
      res.status(406).json({ message: "No tienes los suficientes privilegios" })
    }

    req.session = {
      estado: Number(tokenVal.estado),
      idu: Number(tokenVal.idu),
      nombre: tokenVal.nombre,
      rol: Number(tokenVal.rol),
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}


export async function UnAdmin(req:Express.RequestS, res:Response) {
    const {id} = req.params
    console.log("--------------------------------")
    console.log(id)
    console.log("--------------------------------")
    try {
        let result = await sequelize.query(`SELECT 
    u.nombre_completo AS AdminC,
   o.idOrden AS Ordenid, 
   o.fecha_creacion AS OrdenFecha,
   o.nombre_completo AS Nombre,
   o.total_orden AS Total,
   o.completado
            FROM usuarios u
             LEFT JOIN Orden o ON o.usuarios_idusuarios = u.idusuarios  
               WHERE idusuarios = :id
             `, {
            replacements:{
                id
            },
            type:QueryTypes.SELECT
        })
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

export async function TodosLosAdmins(req:Express.RequestS, res:Response) {
    try {
        let result = await sequelize.query(`SELECT 
    idusuarios,
    rol_idrol,
    estados_idestados,
    correo_electronico,
    nombre_completo,
    telefono,
    fecha_nacimiento,
    fecha_creacion,
    Clientes_idClientes
             FROM usuarios`, {
            type:QueryTypes.SELECT
        })
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}

export async function DesactivarA(req:Express.RequestS, res:Response) {
    const {id} = req.params
    try {
        let result = await sequelize.query("EXEC InactivarUsuario :id, 2", {
            replacements: {
                id
            },
            type: QueryTypes.RAW
        })
    res.status(200).json({})
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function ActivarA(req:Express.RequestS, res:Response) {
    const {id} = req.params
    try {
        let result = await sequelize.query("EXEC InactivarUsuario :id, 1", {
            replacements: {
                id
            },
            type: QueryTypes.RAW
        })
    res.status(200).json({})
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}

export async function RegisterUser(req:Express.RequestS, res: Response) {
  const datos = req.body
  console.log(datos)
  try {
    let { email,telefono, nombre } = datos
    let pass = await pwdUtil.RandomPass(8)
    const passH = await HassPass(pass, 10)
    let [reusltados] = await sequelize.query(
      "EXEC CrearUsuarios :rol_idrol, :estados_idestados, :correo_electronico, :nombre_completo, :password, :telefono",
      {
        replacements: {
          rol_idrol: 1,
          estados_idestados: 1,
          correo_electronico: email,
          password: passH,
          telefono,
          nombre_completo: nombre,
        },
        type: QueryTypes.RAW,
      },
    )
    console.log(reusltados)
    await SendEmail(email, nombre, {
      asunto: "Confirmar usuario",
      body: `<div style='width:100%; display:flex; justify-content:center; align-items:center;'>
      <h1>Felicidades tu usuario fue creado</h1>
      <p>Tu Correo: ${email}</p>
      <p>Tu Password: ${pass}</p>
      </div>`,
    })
    res.status(200).json({ created: true, error: null })
  } catch (error) {
    console.log(error)
    res.status(404).json({ created: false, error: error })
  }
}