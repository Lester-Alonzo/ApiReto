import { Router } from "express"
import {
  MiddlewareORden,
  ListAll,
  ListOne,
  Authorizacion,
  ListAllUser,
  Crear,
  Rechazar,
  EntregarOrden,
  GetOne,
  DeleteOrdenDetalle,
  RechazarByUser,
} from "../controllers/ordend"

const Orden = Router()

Orden.use(MiddlewareORden)

/**
 * @swagger
 * /ordend/all:
 *   get:
 *     summary: Muestra todas las ordenes
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     responses:
 *       200:
 *         description: Se muestra una lista de todas las ordenes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Estados
 *       400:
 *         description: Datos de entrada inválidos o faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       401:
 *         description: No autorizado. Se requiere token de sesión o es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 */
Orden.get("/all", ListAll)
Orden.get("/one/:id", GetOne)
Orden.get("/autorizar/:id", Authorizacion)
Orden.get("/rechazar/:id", Rechazar)
Orden.post("/crear", Crear)
Orden.get("/orders", ListAllUser)
Orden.get("/order/:orderid", ListOne)
Orden.put("/entregar/:id", EntregarOrden)
Orden.delete("/odel/:id", DeleteOrdenDetalle)
Orden.delete("/odelbuser/:id", RechazarByUser)

export { Orden }
