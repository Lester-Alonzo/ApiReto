import type { Request, Response, NextFunction } from "express"
import {randomUUID} from 'crypto'
import {QueryTypes} from '@sequelize/core'
import type {Express} from '../types'
import { keyDB } from "../db/keydbConf"
import { sequelize } from "../db/mssql"
import {Producto} from '../lib/zchemas'

export async function MiddlewareProducts(
  req: Express.RequestS,
  res: Response,
  next: NextFunction,
) {
  let sessionToken = req.headers["session"] as string
  if (!(await keyDB.exists(sessionToken)))
    res.status(405).json({ message: "Error con la session" })
  let tokenVal = await keyDB.hgetall(sessionToken)
  console.log(tokenVal)
  if (Number(tokenVal.rol && req.originalUrl.includes("create")) !== 1)
    res.status(406).json({ message: "No tienes los soficientes privilegios" })
  else {
    req.session = {
        estado: Number(tokenVal.estado),
        idu: Number(tokenVal.idu),
        nombre:tokenVal.nombre,
        rol:Number(tokenVal.rol)
    }
    next()
  } 
}

export async function ListAll(req: Express.RequestS, res: Response) {
  const { offset, page, price, marca } = req.query
  console.log(offset, page, price, marca)
  try {
    const [resultado] = await sequelize.query(
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
      ${req.session?.rol !== 1 ? 'WHERE p.estados_idestados = 1':""}`, //TODO: Hacerlo de manera automatica evaluando si es admin o cliente
    {
        type:QueryTypes.SELECT
    })
    res.status(200).json(resultado)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function CraerProducto(req:Express.RequestS, res:Response) {
    const datos = req.body
    try {
        const {categoria, estado, marca, nombre, precion,stock} = Producto.parse(datos)
        const [resultado] = await sequelize.query(`EXEC CrearProductos :CategoriaProductos_IDCategoria, :usuarios_idusuarios, :nombre, :marca, :codigo, :stock, :estados_idestados, :precio`, {
            replacements:{
                usuarios_idusuarios: req.session?.idu,
                nombre,
                marca,
                codigo: randomUUID(),
                stock,
                estados_idestados: estado,
                CategoriaProductos_IDCategoria:categoria,
                precio: precion
            },
            type:QueryTypes.RAW
        })
    res.status(200).json(resultado)
    } catch (error) {
        console.error(error)
        res.status(404).json({})
    }
}
export async function UpdateProduct(req:Express.RequestS, res:Response) {
    const {id} = req.params
    const data = req.body
    try {
        await sequelize.query(`EXEC ActualizarProducto :id, :Campo, :NuevoValor`, {
            replacements:{
                id,

            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({})
    }
}