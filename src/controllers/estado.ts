import type { Request, Response, NextFunction} from 'express'
import {sequelize} from '../db/mssql'
import type {Express} from '../types'
import {keyDB} from '../db/keydbConf'


export async function MiddlewareEstado(req:Express.RequestS, res:Response, next:NextFunction):Promise<void> {
    try {
      let sessionToken = req.headers["session"] as string
      if (!(await keyDB.exists(sessionToken))) {
        res.status(405).json({ message: "Error con la session" })
      }

      let tokenVal = await keyDB.hgetall(sessionToken)
      console.log(tokenVal)

      if (Number(tokenVal.rol) !== 1 && req.originalUrl.includes("create")) {
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

export async function TodosLosEstados(req:Request, res:Response) {
    try {
        let result = await sequelize.query(`SELECT * FROM estados`)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({})
    }
}

export async function CreateEstado(req:Request, res:Response) {
    const {nombre} = req.body
    try {
        let rs = await sequelize.query(`EXEC CrearEstado :nombre`, {
            replacements:{
                nombre
            }
        })
        res.status(200).json({})
    } catch (error) {
        res.status(400).json({})
    }
}

export async function EditarEstado(req:Request, res:Response) {
    const {id} = req.params
    const {nombre} = req.body
    try {
        await sequelize.query(`EXEC ActualizarEstado :idestados, :nombre`, {
            replacements:{
                idestados: id,
                nombre
            }
        })
        res.status(200).json()
    } catch (error) {
        res.status(400).json()
    }
}