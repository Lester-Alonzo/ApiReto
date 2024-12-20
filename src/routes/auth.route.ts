import { Router } from "express"
import {
  Login,
  Register,
  ChangePass,
  CpassC,
  ChanginPass,
} from "../controllers/auth"

const auth = Router()


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Ruta para crear Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pass
 *               - estado
 *               - rol
 *               - telefono
 *               - nombre
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del administrador.
 *                 example: admin@example.com
 *               pass:
 *                 type: string
 *                 description: Contraseña del administrador
 *                 example: Desafio360@
 *               estado:
 *                 type: number
 *                 description: Estado Activo 1, Inactivo 2
 *                 example: 1
 *               rol:
 *                 type: number
 *                 description: Rol del usuario 1 Admin, 2 Cliente
 *                 example: 1
 *               telefono:
 *                 type: string
 *                 description: Telefono con el formato XXXX-XXXX
 *                 example: 8989-5858
 *               nombre:
 *                 type: string
 *                 description: Nombre del admin
 *                 example: Admin de Prueba
 *     responses:
 *       200:
 *         description: Se creo el ususario correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación.
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
auth.post("/register", Register)

/**
 * @swagger
 * /auth/login:
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
 *               - pass
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del administrador.
 *                 example: admin@example.com
 *               pass:
 *                 type: string
 *                 description: Contraseña del administrador
 *                 example: Desafio360@
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Regresa el token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación.
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
auth.post("/login", Login)
/**
 * @swagger
 * /auth/change_password:
 *   post:
 *     summary: Ruta para crear Admins
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
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Se genero el enlace para cambiar la password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Url para cambiar la password.
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
auth.post("/change_password", ChangePass)

//Estas rutas es mas comodo evaluarlas cuando ya este echo el front
auth.get("/cpass_confirm/:key", CpassC)
auth.post("/changing_pass/:id", ChanginPass)
// auth.post("/confirm_email/:user_hash")

export { auth }
