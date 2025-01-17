import type { Request, Response, NextFunction } from "express"
import { sequelize } from "../db/mssql"
import type { Express } from "../types"
import { keyDB } from "../db/keydbConf"
import { QueryTypes } from "@sequelize/core"
import { Clientes } from "../lib/zchemas"
import { secreKeyJWT } from "../lib/constants"
import jwt from "jsonwebtoken"
import { PswUtils } from "../lib/utils/OTPswd"
import {SendEmail} from '../lib/mail'

import {HassPass, ComparePassword} from '../lib/utils/encry'
import type { ClientesAtt} from '../db/models/clientes'
import {randomUUID} from 'crypto'
process.loadEnvFile()

interface Clientes {
  idClientes?: number
  razon_social?: string
  nombre_comercial: string
  direccion_entrega: string
  telefono: string
  email: string
  estado_idEstado: number
}

const puutils = new PswUtils(4, "644ebf0164fb6466c846")

export async function MiddlewareClientes(
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

    if (
      Number(tokenVal.rol) !== 1 &&
      req.originalUrl.includes("all") &&
      Number(tokenVal.estado) === 2
    ) {
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
export async function MiddlewareCliente(
  req: Express.RequestS,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let sessionToken = req.headers["session"] as string
    if (!(await keyDB.exists(sessionToken)) && !req.originalUrl.includes("crear")) {
      console.log("Soy el if de error", req.originalUrl.includes("crear"))
      res.status(405).json({ message: "Error con la session" })
    }else if(!(await keyDB.exists(sessionToken)) || req.originalUrl.includes("crear")) {
      console.log("soy el else if")
      next()
    }

    let tokenVal = await keyDB.hgetall(sessionToken)
    console.log(tokenVal)

    if (
      req.originalUrl.includes("all") &&
      Number(tokenVal.estado) === 2
    ) {
      console.log("Soy el if de error de priviligios")
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

export async function TodosLosClientes(req: Express.RequestS, res: Response) {
  try {
    let result = await sequelize.query(
      `
            SELECT * FROM Clientes;
            `,
      {
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({})
  }
}
export async function VerifyUser(req: Express.RequestS, res: Response) {
  try {
    let result = await sequelize.query(
      `
            SELECT * FROM Clientes WHERE idClientes = :id ;
            `,
      {
        replacements: {
          id: req.session?.idu,
        },
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({})
  }
}

export async function Crear(req: Express.RequestS, res: Response) {
  const data = req.body
  console.log(data)
  try {
    const { direccion, email, nombre, razonsocial, telefono, pass} =
      Clientes.parse(data)
    const passH = await HassPass(pass, 10)
    await sequelize.query(
      `
            EXEC CrearClientes :razon, :nombre, :direccion, :telefono, :email, :estado, :pass
            `,
      {
        replacements: {
          razon: razonsocial,
          nombre,
          direccion,
          telefono,
          estado: 1,
          email,
          pass: passH
        },
        type: QueryTypes.RAW,
      },
    )
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function LoginV1(req: Express.RequestS, res: Response) {
  const { email } = req.body
  try {
    let [resultado]: Clientes[] = await sequelize.query(
      `
            SELECT * FROM Clientes WHERE email = :mail
            `,
      {
        replacements: {
          mail: email,
        },
        type: QueryTypes.SELECT,
      },
    )
    if (resultado === undefined) throw new Error("Usuario no encontrado")
    const hassed = puutils.encrypt(
      JSON.stringify({
        idu: resultado.idClientes,
        rol: 2,
        estado: resultado.estado_idEstado,
        nombre: resultado.nombre_comercial,
      }),
    )
    let rund = crypto.randomUUID()
    let url = `${process.env.urlfront}confirmlogin/${rund}`
    await keyDB.set(rund, hassed)
    await SendEmail(resultado.email, resultado.nombre_comercial, {
      asunto: "Login en la app",
      body: `<a href="${url}">Confirmar Login</a>`,
    })
    res.status(200).json({ url })
  } catch (error) {
    console.error(error)
    res.status(400).json({})
  }
}


export async function LoginV2(req: Express.RequestS, res: Response) {
  const { email, pass } = req.body
  try {
    let [resultado]: ClientesAtt[] = await sequelize.query(
      "SELECT * FROM Clientes WHERE email = :mail",
      {
        replacements: {
          mail: email,
        },
        type: QueryTypes.SELECT,
      },
    )
    if (resultado === undefined) throw new Error("Usuario no encontrado")
      console.log(resultado.password, pass)
    let result = await ComparePassword(pass, resultado.password)
    if(!result) throw new Error("Password Erronea")
    const payload = {
      idu: resultado.idClientes,
      rol: 2,
      estado: resultado.estado_idEstado,
      nombre: resultado.nombre_comercial,
    }
    if(payload.estado !== 1) res.status(400).json({message:"Tu usuario esta Desactivado"})
    let acceskey = randomUUID()
    const token = jwt.sign(payload, secreKeyJWT)
    await keyDB.hmset(acceskey, payload)
    await keyDB.expire(acceskey, 86400)
    res.status(200).json({token, session:acceskey, error:null})
  } catch (error) {
    console.error(error)
    res.status(400).json({token:null, message:"Credenciales Erroneas"})
  }
}

export async function ConfirmLogin(req: Express.RequestS, res: Response) {
  const { key } = req.params
  try {
    if (!key || (await keyDB.exists(key)) === 0)
      throw new Error("Llave erronea")
    let encypuser = (await keyDB.get(key)) as string
    let user = JSON.parse(puutils.decrypt(encypuser))
    if(user.estado !== 1) res.status(404).json({})
    const payload = {
      idu: user.idu,
      rol: user.rol,
      estado: user.estado,
      nombre: user.nombre,
    }
    const token = jwt.sign(payload, secreKeyJWT, {
      expiresIn: "24h",
      algorithm: "HS256",
    })
    //Guardar la session en KeyDB(equivalente a Redis)
    let acceskey = crypto.randomUUID()
    await keyDB.hmset(acceskey, payload)
    await keyDB.expire(acceskey, 86400)
    //Se setea un header con la key de KeyDB
    res.status(200).json({ token: token, error: null, session: acceskey })
  } catch (err) {
    console.log(err)
  }
}

export async function EliminarCliente(req: Express.RequestS, res: Response) {
  const { id } = req.params
  try {
    const [] = await sequelize.query(
      `EXEC InactivarCliente :cliente, :estado `,
      {
        replacements: {
          cliente: id,
          estado: 2,
        },
        type: QueryTypes.RAW,
      },
    )
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json({})
    throw error
  }
}

export async function ActivarCliente(req: Express.RequestS, res: Response) {
  const { id } = req.params
  try {
    const [] = await sequelize.query(
      `EXEC InactivarCliente :cliente, :estado `,
      {
        replacements: {
          cliente: id,
          estado: 1,
        },
        type: QueryTypes.RAW,
      },
    )
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json({})
    throw error
  }
}

export async function UpdateCliente(req: Express.RequestS, res: Response) {
  const { id } = req.params
  //data = [{campo:string, valor:any}=]
  const data = req.body
  console.log(data, id)
  try {
    const transaction = await sequelize.transaction(async (t) => {
      try {
        for (const element of data) {
          await sequelize.query(
            `EXEC ActualizarCampoClientes :id, :Campo, :NuevoValor`,
            {
              replacements: {
                id,
                Campo: element.campo,
                NuevoValor: element.nval,
              },
              type: QueryTypes.RAW,
              transaction: t,
            },
          )
        }
        res.status(200).json({})
      } catch (error) {
        console.log("Error en la transaccion")
      }
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({})
    throw error
  }
}

export async function SetCart(req: Express.RequestS, res: Response) {
  const data = req.body
  let uid = req.session?.nombre
  console.log(data, uid)

  try {
    await keyDB.lpush(String(uid), data)
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function GetCart(req: Express.RequestS, res: Response) {
  console.log(req.session?.idu)
  let uid = req.session?.idu
  try {
    let data = await keyDB.lrange(String(uid), 0, -1)
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}

export async function ChangePass(req: Request, res: Response) {
  let { email } = req.body
  let ruid = randomUUID()
  try {
    let [resultados]: ClientesAtt[] = await sequelize.query(
      "SELECT * FROM usuarios WHERE correo_electronico = :email",
      {
        replacements: { email: email },
        type: QueryTypes.SELECT,
      },
    )
    let url = `${process.env.urlfront}cpass/${ruid}`
    await keyDB.hset(ruid, {id:resultados.idClientes, estado:resultados.estado_idEstado})
    if (resultados === undefined) throw new Error("Usuario no encontrado")
    await SendEmail(resultados.email, resultados.nombre_comercial, {asunto:"Cambio de Password", body:`
  <div>
      <a href="${url}">Cambio de Password</a>
  </div>
      `})
    res.status(200).json({ url })
  } catch (error) {
    res.status(400).json({ error })
  }
}

export async function ChangePassClientes(req: Express.RequestS, res: Response) {
  const {key} = req.params
  let estado = await keyDB.hgetall(key)
  const {nval} = req.body
  try {
    await sequelize.query("EXEC ActualizarCampoClientes :id, password, :nval", {
      replacements:{
        id:Number(estado.id), 
        nval
      },
      type:QueryTypes.RAW
    })
    await keyDB.hdel(key)
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(200).json({error})
  }
}