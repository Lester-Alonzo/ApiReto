import type { Response, NextFunction } from "express"
import { randomUUID } from "crypto"
import { QueryTypes } from "@sequelize/core"
import { keyDB } from "../db/keydbConf"
import type { Express } from "../types"
import { sequelize } from "../db/mssql"
import { Producto } from "../lib/zchemas"
import { UpImage } from "../lib/utils/upload"

export async function MiddlewareProduct(
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

export async function ListAll(req: Express.RequestS, res: Response) {
  const { offset, page, price, marca } = req.query
  console.log(offset, page, price, marca, req.session)
  try {
    const resultado = await sequelize.query(
      `SELECT 
      p.*, 
      c.nombre AS Categoria_nombre,
      e.nombre AS estado_nombre
      FROM 
        Productos p 
      JOIN 
        CategoriaProductos c ON p.CategoriaProductos_IDCategoria = c.idCategoriaProductos 
      JOIN 
        estados e ON p.estados_idestados = e.idestados
      ${req.session?.rol !== 1 ? "WHERE p.estados_idestados = 1" : " "}
      `,
      {
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(resultado)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function CraerProducto(
  req: Express.RequestS,
  res: Response,
): Promise<void> {
  const datos = req.body
  try {
    if (!req.file) res.status(400).send("No se ha subido ninguna imagen")
    const { categoria, estado, marca, nombre, precion, stock } =
      Producto.parse(datos)
    const fotoUrl = await UpImage(
      Buffer.from(req.file?.buffer as Buffer).toString("base64"),
    )
    const [resultado] = await sequelize.query(
      `EXEC CrearProductos :CategoriaProductos_IDCategoria, :usuarios_idusuarios, :nombre, :marca, :codigo, :stock, :estados_idestados, :precio, :foto`,
      {
        replacements: {
          usuarios_idusuarios: req.session?.idu,
          nombre,
          marca,
          codigo: randomUUID(),
          stock,
          estados_idestados: estado,
          CategoriaProductos_IDCategoria: categoria,
          precio: precion,
          foto: fotoUrl,
        },
        type: QueryTypes.RAW,
      },
    )
    res.status(200).json(resultado)
  } catch (error) {
    console.error(error)
    res.status(404).json({})
  }
}
export async function UpdateProduct(req: Express.RequestS, res: Response) {
  const { id } = req.params
  const data = req.body
  try {
    await sequelize.query(`EXEC ActualizarProducto :id, :Campo, :NuevoValor`, {
      replacements: {
        id,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({})
  }
}

export async function EliminarProducto(req: Express.RequestS, res: Response) {
  const { id } = req.params
  const { estado } = req.query
  try {
    let result = await sequelize.query(
      `EXEC InactivarProductor :idProducto, :idEstado`,
      {
        replacements: {
          idProducto: id,
          idEstado: estado,
        },
      },
    )
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(404).json({})
  }
}
