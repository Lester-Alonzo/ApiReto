import { Router } from "express"
import {
  CrearRol,
  MiddlewareRol,
  TodosRoles,
  UpdateRol,
} from "../controllers/rol"

const rol = Router()

rol.use(MiddlewareRol)

/**
 * @swagger
 * /rol/all:
 *   get:
 *     summary: Muestra todos los roles a un usuario
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     responses:
 *       200:
 *         description: Se muestra una lista de todos los roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 type: object
 *                 description: Clientes
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
rol.get("/all", TodosRoles)
rol.post("/crear", CrearRol)
rol.put("/editar/:id", UpdateRol)

export { rol }
