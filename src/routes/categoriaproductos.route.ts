import { Router } from "express"
import {
  MiddlewareCP,
  CrearCategoria,
  EditarCategoria,
  TodosLosCP,
} from "../controllers/categoriaproductos"

const CatProdu = Router()

CatProdu.use(MiddlewareCP)

/**
 * @swagger
 * /categoria/all:
 *   get:
 *     summary: Muestra todas las categorias
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     responses:
 *       200:
 *         description: Se muestra una lista de todas las categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Objeto de categoria
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
CatProdu.get("/all", TodosLosCP)

/**
 * @swagger
 * /categoria/crear:
 *   post:
 *     summary: Crear una nueva categoria
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *               - nombre
 *             properties:
 *               estado:
 *                 type: number
 *                 description: Estado Activo 1, Inactivo 2
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoria
 *                 example: Ropa
 *     responses:
 *       200:
 *         description: Se creo la categoria Correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *         description: Credenciales inválidas.
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
CatProdu.post("/crear", CrearCategoria)

/**
 * @swagger
 * /categoria/editar/{id}:
 *   put:
 *     summary: Crear una nueva categoria
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *       - in: path
 *         name: id
 *         schema:
 *            type: string
 *         required: true
 *         description: id de la categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *               - nombre
 *             properties:
 *               estado:
 *                 type: number
 *                 description: Estado Activo 1, Inactivo 2
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoria
 *                 example: Ropa
 *     responses:
 *       200:
 *         description: Se actualizo correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *         description: Credenciales inválidas.
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
CatProdu.put("/editar/:id", EditarCategoria)
//rol.delete("/eliminar/:id")

export { CatProdu }
