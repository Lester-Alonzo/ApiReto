import type { Request, Response, NextFunction} from 'express'
import {sequelize} from '../db/mssql'
import type {Express} from '../types'
import {keyDB} from '../db/keydbConf'
import { QueryTypes } from 'sequelize'
import {agregarDiasAFecha} from '../lib/utils/fecha'
import { Orden } from '../lib/zchemas'

export async function MiddlewareORden(req:Express.RequestS, res:Response, next:NextFunction):Promise<void> {
    try {
      let sessionToken = req.headers["session"] as string
      if (!(await keyDB.exists(sessionToken))) {
        res.status(405).json({ message: "Error con la session" })
      }

      let tokenVal = await keyDB.hgetall(sessionToken)
      console.log(tokenVal)

      if (Number(tokenVal.rol) !== 1 && req.originalUrl.includes("all") && req.originalUrl.includes("autorizar") ) {
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

export async function ListAll(req:Express.RequestS, res:Response) {
    try {
        let result = await sequelize.query(
            `
            SELECT 
            o.*,
            COUNT(d.idOrdenDetalles) AS Cantidad_Productos
            FROM 
            orden o
            INNER JOIN
            OrdenDetalles d ON o.idOrden = d.Orden_idOrden
            GROUP BY
                o.idOrden, o.usuarios_idusuarios, o.estados_idestados, o.client_idClient, o.fecha_creacion, o.nombre_completo, o.direccion, o.telefono, o.correo_electronico, o.fecha_entrega, o.total_orden
            `, {
            type:QueryTypes.SELECT
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}

export async function ListOne(req:Express.RequestS, res:Response) {
    const {orderid} = req.params
    try {
        let result = await sequelize.query(`SELECT 
            d.cantidad,
            d.precio,
            p.nombre
            FROM 
            orden o 
            INNER JOIN 
            OrdenDetalles d ON o.idOrden = d.Orden_idOrden
            INNER JOIN 
            Productos p ON d.Productos_idProductos = p.idProductos
            WHERE o.idOrden = :id
            `, {
            replacements:{
                id:orderid
            },
            type:QueryTypes.SELECT
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function Authorizacion(req:Express.RequestS, res:Response) {
    const {id} = req.params
    const {useid} = req.body
    try {
        const [q1, q2] = await Promise.all([
        await sequelize.query(`
            EXEC ActualizarCampoOrden :id, :campo, :nval
            `,{
                replacements:{
                    id,
                    campo:"usuarios_idusuarios",
                    nval:useid
                }
            }),
        await sequelize.query(`
            EXEC ActualizarCampoOrden :id, :campo, :nval
            `, {
                replacements:{
                    id,
                    campo:"fecha_entrega",
                    nval: agregarDiasAFecha(new Date(), 2)
                },
                type:QueryTypes.RAW
            })
        ])
        console.log(q1, q2)
        res.status(200).json({})
    } catch (error) {
        console.error(error)
        res.status(400).json({})
    }
}
export async function ListAllUser(req:Express.RequestS, res:Response) {
    try {
        let result = await sequelize.query(
            `
            SELECT 
            o.*,
            COUNT(d.idOrdenDetalles) AS Cantidad_Productos
            FROM 
            orden o
            INNER JOIN
            OrdenDetalles d ON o.idOrden = d.Orden_idOrden
            GROUP BY
                o.idOrden, o.usuarios_idusuarios, o.estados_idestados, o.client_idClient, o.fecha_creacion, o.nombre_completo, o.direccion, o.telefono, o.correo_electronico, o.fecha_entrega, o.total_orden
            WHERE o.client_idClient = :id
            `, {
            replacements:{
                id:req.session?.idu
            },
            type:QueryTypes.SELECT
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).json({})
    }
}
export async function Crear(req:Express.RequestS, res:Response) {
    //TODO: crear pedido y articulos en zod
    const data = req.body
    try {
        const {articulos, pedido} = Orden.parse(data)
        const resultado = await sequelize.transaction(async(t) => {
            const nuevoPedido = await sequelize.query(`
                EXEC CrearOrdenes NULL, :estadoID, :nombreCompleto, :direccion, :telefono, :correo_electronico, :total_orden, :cliente;
                `,{
                    replacements:{
                        estadoID: pedido.estado,
                        nombreCompleto: pedido.nombreCom,
                        direccion: pedido.direccion,
                        telefono:pedido.telefono,
                        correo_electronico: pedido.correo,
                        total_orden: pedido.total,
                        cliente: pedido.cliente
                    },
                    type:QueryTypes.RAW,
                    transaction:t
                })
            const idPedido = (nuevoPedido[0][0] as any).IdPedido

            for (const element of articulos) {
                await sequelize.query(`
                EXEC CrearOrdenDetalles :ordenid, :productoid, :cantidad, :precio, :subtotal
                    `, {
                        replacements: {
                            ordenid: idPedido,
                            productoid: element.pid,
                            cantidad: element.cantidad,
                            precio: element.precio,
                            subtotal: element.subtotal
                        },
                        type:QueryTypes.RAW,
                        transaction:t
                    })
            }
            return nuevoPedido
        })
        console.log(resultado)
        res.status(200).json({})
    } catch (error) {
        console.error(error)
        res.status(400).json({})
    }
}