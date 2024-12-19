import type { Request, Response, NextFunction} from 'express'
import {sequelize} from '../db/mssql'
import type {Express} from '../types'
import {keyDB} from '../db/keydbConf'
import { QueryTypes } from '@sequelize/core'
import {Clientes} from '../lib/zchemas'
import { secreKeyJWT } from "../lib/constants"
import jwt from "jsonwebtoken"
import {PswUtils} from '../lib/utils/OTPswd'


interface Clientes {
  idClientes?: number
  razon_social?: string
  nombre_comercial: string
  direccion_entrega: string
  telefono: string
  email: string
  estado_idEstado:number
}

const puutils = new PswUtils(4, "644ebf0164fb6466c846")

export async function MiddlewareClientes(req:Express.RequestS, res:Response, next:NextFunction):Promise<void> {
    try {
      let sessionToken = req.headers["session"] as string
      if (!(await keyDB.exists(sessionToken))) {
        res.status(405).json({ message: "Error con la session" })
      }

      let tokenVal = await keyDB.hgetall(sessionToken)
      console.log(tokenVal)

      if (Number(tokenVal.rol) !== 1 && req.originalUrl.includes("all") && req.originalUrl.includes("crear") ) {
        res
          .status(406)
          .json({ message: "No tienes los suficientes privilegios" })
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


export async function TodosLosClientes(req:Express.RequestS, res:Response) {
    try {
        let result = await sequelize.query(`
            SELECT * FROM Clientes;
            `,{
                type:QueryTypes.SELECT
            })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(400).json({})
    }
}

export async function Crear(req:Express.RequestS, res:Response) {
    const data = req.body
    try {
        const {direccion,email, estado, nombre, razonsocial, telefono} = Clientes.parse(data)
        await sequelize.query(`
            EXEC CrearCliente :razon, :nombre, :direccion, :telefono, :email, :estado
            `,{
                replacements:{
                    razon:razonsocial,
                    nombre,
                    direccion,
                    telefono,
                    estado,
                    email
                },
                type: QueryTypes.RAW
            })
    } catch (error) {
        console.log(error)
    }
}
export async function Login(req:Express.RequestS, res:Response) {
    const {email} = req.body
    try {
        let [resultado]: Clientes[] = await sequelize.query(`
            SELECT * FROM Clientes WHERE email = :mail
            `,
        {
            replacements:{
                mail: email
            },
            type:QueryTypes.SELECT
        })
        if(resultado === undefined) throw new Error("Usuario no encontrado")
        const hassed = puutils.encrypt(JSON.stringify({
            idu:resultado.idClientes,
            rol:2,
            estado:resultado.estado_idEstado,
            nombre:resultado.nombre_comercial
        }))
        let rund = crypto.randomUUID()
        let url = `${req.protocol}://${req.host}${req.baseUrl}/confirmlogin/${rund}`
    await keyDB.set(
      rund,
      hassed,
    )
    res.status(200).json({url})
    } catch (error) {
        console.error(error)
        res.status(400).json({})
    }
}
export async function ConfirmLogin(req:Express.RequestS, res:Response) {
    const {key} = req.params
    try {
        if (!key || (await keyDB.exists(key)) === 0)
      throw new Error("Llave erronea")
        let encypuser = await keyDB.get(key) as string
        let user = JSON.parse(puutils.decrypt(encypuser)) 
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
    await keyDB.hmset(acceskey, payload )
    await keyDB.expire(acceskey, 86400)
    //Se setea un header con la key de KeyDB
    res.cookie("sessionKey", acceskey, {
      httpOnly: true,
      maxAge: 18000000,
    })
    res.status(200).json({ token: token, error: null })
    } catch (err) {
        console.log(err)
    }
}