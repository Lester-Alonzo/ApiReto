import type { Request, Response, NextFunction } from "express"
import { sequelize } from "../db/mssql"
import type { Express } from "../types"
import { keyDB } from "../db/keydbConf"
import { QueryTypes } from "sequelize"
import { agregarDiasAFecha } from "../lib/utils/fecha"

export async function MiddlewareORden(
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
      req.originalUrl.includes("crear") ||
      req.originalUrl.includes("orders") ||
      req.originalUrl.includes("odelbuser")
    ) {
      req.session = {
        estado: Number(tokenVal.estado),
        idu: Number(tokenVal.idu),
        nombre: tokenVal.nombre,
        rol: Number(tokenVal.rol),
      }
      console.log("soy permitir user", tokenVal.idu, sessionToken)
      return next()
    }
    if (
      Number(tokenVal.rol) !== 1 &&
      (req.originalUrl.includes("all") ||
      req.originalUrl.includes("autorizar") || req.originalUrl.includes("odel"))
    ) {
    console.log("soy rechazado por permisos")
      res.status(406).json({ message: "No tienes los suficientes privilegios" })
    }
    console.log("soy admin")
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
                o.idOrden, o.usuarios_idusuarios, o.estados_idestados, o.client_idClient, o.fecha_creacion, o.nombre_completo, o.direccion, o.telefono, o.correo_electronico, o.fecha_entrega, o.total_orden, o.completado
            `,
      {
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}

export async function ListOne(req: Express.RequestS, res: Response) {
  const { orderid } = req.params
  try {
    let result = await sequelize.query(
      `SELECT 
            d.idOrdenDetalles AS id,
            d.cantidad,
            d.precio,
            p.nombre,
            p.stock
            FROM 
            orden o 
            INNER JOIN 
            OrdenDetalles d ON o.idOrden = d.Orden_idOrden
            INNER JOIN 
            Productos p ON d.Productos_idProductos = p.idProductos
            WHERE o.idOrden = :id
            `,
      {
        replacements: {
          id: orderid,
        },
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function Authorizacion(req: Express.RequestS, res: Response) {
  const { id } = req.params
  try {
    const [q1, q2] = await Promise.all([
      //se coloca el id del usuario admin que autorizo el pedido
      await sequelize.query(
        `
            EXEC ActualizarCampoOrden :id, :campo, :nval
            `,
        {
          replacements: {
            id,
            campo: "usuarios_idusuarios",
            nval: req.session?.idu,
          },
        },
      ),
      //se agrega la fecha de entrega
      await sequelize.query(
        `
            EXEC ActualizarCampoOrden :id, :campo, :nval
            `,
        {
          replacements: {
            id,
            campo: "fecha_entrega",
            nval: agregarDiasAFecha(new Date(), 2),
          },
          type: QueryTypes.RAW,
        },
      ),
    ])
    console.log(q1, q2)
    res.status(200).json({})
  } catch (error) {
    console.error(error)
    res.status(400).json({})
  }
}
export async function ListAllUser(req: Express.RequestS, res: Response) {
  console.log("soy Todas las ordenes", req.session?.idu)
  try {
    let result = await sequelize.query(
      `
            SELECT 
            *
            FROM 
            orden
            WHERE client_idClient = :id
            `,
      {
        replacements: {
          id: Number(req.session?.idu),
        },
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}
export async function Crear(req: Express.RequestS, res: Response) {
  //TODO: crear pedido y articulos en zod
  const { articulos, pedido } = req.body
  console.log("Articulos------------------------------")
  console.log(articulos)
  console.log("pedido------------------------------")
  console.log(pedido)
  console.log(req.session?.idu)
  try {
    const resultado = await sequelize.transaction(async (t) => {
      try {
        const nuevoPedido = await sequelize.query(
          `
                EXEC CrearOrdenes NULL, :estadoID, :nombreCompleto, :direccion, :telefono, :correo_electronico, :total_orden, :cliente;
                `,
          {
            replacements: {
              estadoID: 1,
              nombreCompleto: pedido.nombre_completo,
              direccion: pedido.direccion,
              telefono: pedido.telefono,
              correo_electronico: pedido.correo_electronico,
              total_orden: parseFloat(pedido.total_orden),
              cliente: req.session?.idu,
            },
            type: QueryTypes.RAW,
            transaction: t,
          },
        )
        const idPedido = (nuevoPedido[0][0] as any).IdPedido

        for (const element of articulos) {
          await sequelize.query(
            `
                EXEC CrearOrdenDetalles :ordenid, :productoid, :cantidad, :precio, :subtotal
                    `,
            {
              replacements: {
                ordenid: idPedido,
                productoid: element.Productos_idProductos,
                cantidad: element.cantidad,
                precio: parseFloat(element.precio),
                subtotal: parseFloat(element.subtotal),
              },
              type: QueryTypes.RAW,
              transaction: t,
            },
          )
        }
        return nuevoPedido
      } catch (error) {
        console.log(error)
        await t.rollback()
      }
    })
    console.log(resultado)
    res.status(200).json({})
  } catch (error) {
    console.error(error)
    res.status(400).json({})
  }
}
export async function Rechazar(req: Express.RequestS, res: Response) {
  const { id } = req.params
  let rol = req.session?.rol
  if (rol !== 1)
    res
      .status(403)
      .json({ message: "No se cuenta con los suficientes privilegios" })
  try {
    let exeCQuery = await sequelize.query(`EXEC InactivarOrden :id, 2`, {
      replacements: {
        id,
      },
      type: QueryTypes.RAW,
    })
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

export async function EntregarOrden(req: Express.RequestS, res: Response) {
  const { id } = req.params
  try {
    let result = await sequelize.query(`EXEC EntregarOrden :id`, {
      replacements: {
        id,
      },
      type: QueryTypes.RAW,
    })
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(404).json({})
    throw error
  }
}

export async function GetOne(req: Express.RequestS, res: Response) {
  const { id } = req.params
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
            WHERE o.client_idClient = :id
            GROUP BY
                o.idOrden, o.usuarios_idusuarios, o.estados_idestados, o.client_idClient, o.fecha_creacion, o.nombre_completo, o.direccion, o.telefono, o.correo_electronico, o.fecha_entrega, o.total_orden, o.completado
            `,
      {
        replacements: {
          id,
        },
        type: QueryTypes.SELECT,
      },
    )
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json({})
  }
}

export async function DeleteOrdenDetalle(req:Express.RequestS, res:Response) {
  const {id} = req.params
  console.log("soy eliminar item cart")
  try {
    await sequelize.query(`DELETE FROM OrdenDetalles WHERE idOrdenDetalles = :id`, {
      replacements:{
        id
      },
      type:QueryTypes.DELETE
    })
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.json(400).json({})
  }
}
export async function RechazarByUser(req: Express.RequestS, res: Response) {
  const { id } = req.params
  console.log("soy eliminar ordenuser")
  try {
    let exeCQuery = await sequelize.query(`EXEC InactivarOrden :id, 2`, {
      replacements: {
        id,
      },
      type: QueryTypes.RAW,
    })
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}