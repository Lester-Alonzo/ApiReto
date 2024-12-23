import { Router } from "express"
import {
  ConfirmLogin,
  Crear,
  Login,
  MiddlewareClientes,
  TodosLosClientes,
} from "../controllers/clientes"

const Clientes = Router()


/**
 * @swagger
 * /clientes/all:
 *   get:
 *     summary: Muestra todos los usuarios a un Admin
 *     parameters:
 *       - in: header
 *         name: session
 *         schema:
 *           type: string
 *         description: Token de sesión del usuario (ingresar manualmente)
 *     responses:
 *       200:
 *         description: Se muestra una lista de todos los usuarios.
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
Clientes.get("/all", MiddlewareClientes, TodosLosClientes)

/**
 * @swagger
 * /clientes/login:
 *   post:
 *     summary: En esta ruta hacen login los admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del administrador.
 *                 example: cliente@example.com
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Regresa el token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Magic Url.
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
Clientes.post("/login", Login)
// esta se ejecuta mejor en el navegador y al final cuando este el Front va a hacer login directamente
Clientes.get("/confirmlogin/:key", ConfirmLogin)

/**
 * @swagger
 * /clientes/crear:
 *   post:
 *     summary: Ruta para crear Clientes 
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
 *               - email
 *               - estado
 *               - telefono
 *               - nombre
 *               - direccion
 *               - razonsocial
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del cliente.
 *                 example: cliente@example.com
 *               estado:
 *                 type: integer
 *                 description: Estado del cliente (Activo o Inactivo)
 *                 enum: [1, 2]
 *                 example: 1
 *               telefono:
 *                 type: string
 *                 description: Teléfono con el formato XXXX-XXXX.
 *                 example: "8989-5858"
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente.
 *                 example: Cliente de Prueba
 *               direccion:
 *                 type: string
 *                 description: Dirección del cliente.
 *                 example: Guatemala, Guatemala Zona 10
 *               razonsocial:
 *                 type: string
 *                 description: Razón Social del cliente.
 *                 example: Empresa Ejemplo S.A.
 *     responses:
 *       200:
 *         description: Cliente creado correctamente.
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
 *         description: No autorizado (Probablemente no se use en la creación de cliente, pero se deja por si se implementa seguridad).
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
Clientes.post("/crear", MiddlewareClientes, Crear)

export { Clientes }
