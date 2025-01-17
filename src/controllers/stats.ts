import type { Request, Response, NextFunction } from "express"
import { sequelize } from "../db/mssql"
import type { Express } from "../types"
import { keyDB } from "../db/keydbConf"
import { QueryTypes } from "sequelize"

export async function MiddlewareStats(
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

export async function ProductosConStock(req:Express.RequestS, res:Response) {
    try {
        let items = await sequelize.query("SELECT * FROM Vista_ProductosActivosConStock;", {
            type:QueryTypes.SELECT
        })
        res.status(200).json(items)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function Ordenes(req:Express.RequestS, res:Response) {
    try {
        let items = await sequelize.query("SELECT * FROM Vista_TotalOrdenesEnero2025;", {
            type:QueryTypes.SELECT
        })
        res.status(200).json(items)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function TopClientes(req:Express.RequestS, res:Response) {
    try {
        let items = await sequelize.query("SELECT * FROM Vista_Top10ClientesMayorConsumo;", {
            type:QueryTypes.SELECT
        })
        res.status(200).json(items)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function TopProductos(req:Express.RequestS, res:Response) {
    try {
        let items = await sequelize.query("SELECT * FROM Vista_Top10ProductosMasVendidos;", {
            type:QueryTypes.SELECT
        })
        res.status(200).json(items)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}