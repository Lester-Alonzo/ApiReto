import { Router } from "express"
import multer from "multer"
import {
  ListAll,
  CraerProducto,
  UpdateProduct,
  MiddlewareProduct,
  EliminarProducto,
  ActivarProducto,
} from "../controllers/producto"
const producto = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits:{fileSize: (10 * 1024 * 1024) } })
/**
 * @swagger
 * /productos/list:
 *   get:
 *     summary: Muestra todos los productos
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     responses:
 *       200:
 *         description: Se muestra una lista de todos los productos.
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
producto.get("/list", MiddlewareProduct, ListAll)
producto.post(
  "/create",
  upload.single("file"),
  MiddlewareProduct,
  CraerProducto,
)
producto.put("/editar/:id", MiddlewareProduct, UpdateProduct)
producto.delete("/eliminar/:id", MiddlewareProduct, EliminarProducto)
producto.put("/activar/:id", MiddlewareProduct, ActivarProducto)

export { producto }
