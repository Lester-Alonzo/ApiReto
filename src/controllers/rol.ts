import type { Request, Response, NextFunction } from "express"
import { sequelize } from "../db/mssql"
import type { Express } from "../types"
import { keyDB } from "../db/keydbConf"

export async function MiddlewareRol(
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

export async function TodosRoles(req: Request, res: Response) {
  try {
    let result = await sequelize.query(`SELECT * FROM rol`)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({})
  }
}
export async function CrearRol(req: Request, res: Response) {
  const { nombre } = req.body
  try {
    let result = await sequelize.query(`EXEC CrearRoles :nombre`, {
      replacements: {
        nombre,
      },
    })
    res.status(200).json()
  } catch (err) {
    res.status(400).json({})
  }
}
export async function UpdateRol(req: Request, res: Response) {
  const { id } = req.params
  const { nombre } = req.body
  try {
    await sequelize.query(`EXEC ActualizarRol :idrol, :nombre`, {
      replacements: {
        idrol: id,
        nombre,
      },
    })
    res.status(200).send("echo")
  } catch (err) {
    res.status(400).json()
  }
}
