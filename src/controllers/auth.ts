//Librerias
import type { Request, Response } from "express"
import { QueryTypes } from "@sequelize/core"
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
//Arvhicos Locales
import { Credentials, LoginSche, PassVal } from "../lib/zchemas"
import { sequelize } from "../db/mssql"
import { ComparePassword, HassPass } from "../lib/utils/encry"
import { PswUtils } from "../lib/utils/OTPswd"
import type { usuariosAtt } from "../db/models/usuarios"
import { secreKeyJWT } from "../lib/constants"
import { keyDB } from "../db/keydbConf"
import {SendEmail} from '../lib/mail'

const PsU = new PswUtils(4, "58a9ffde36ab689dae34")

export async function Login(req: Request, res: Response) {
  const datos = req.body
  try {
    let { email, pass } = LoginSche.parse(datos)
    let [resultados]: usuariosAtt[] = await sequelize.query(
      "SELECT * FROM usuarios WHERE correo_electronico = :email",
      {
        replacements: { email: email },
        type: QueryTypes.SELECT,
      },
    )
    if (resultados === undefined) throw new Error("Usuario no encontrado")
    //Generar un numero random para la OTP
    const rnumber = await PsU.OTPNumber()
    //Validar que la password consida con el hash de la db
    let result = await ComparePassword(pass, resultados.password)
    if (!result) throw new Error("Contrasena incorrecta")
    //* Generar el JWT y el codigo de Session para keydb
    const payload = {
      idu: resultados.idusuarios,
      rol: resultados.rol_idrol,
      estado: resultados.estados_idestados,
      nombre: resultados.nombre_completo,
    }
    const token = jwt.sign(payload, secreKeyJWT, {
      expiresIn: "24h",
      algorithm: "HS256",
    })
    //Guardar la session en KeyDB(equivalente a Redis)
    let acceskey = randomUUID()
    await keyDB.hmset(acceskey, payload)
    await keyDB.expire(acceskey, 86400)
    //Se setea un header con la key de KeyDB
    res.setHeader("session", acceskey)
    res.status(200).json({ token: token, session: acceskey,error: null })
  } catch (error) {
    res.status(404).json({ token: null, error: error })
  }
}

export async function Register(req: Request, res: Response) {
  const datos = req.body
  try {
    let { email, pass, telefono, nombre } =
      Credentials.parse(datos)
    const passH = await HassPass(pass, 10)
    let [reusltados] = await sequelize.query(
      "EXEC CrearUsuarios :rol_idrol, :estados_idestados, :correo_electronico, :nombre_completo, :password, :telefono",
      {
        replacements: {
          rol_idrol: 1,
          estados_idestados: 1,
          correo_electronico: email,
          password: passH,
          telefono,
          nombre_completo: nombre,
        },
        type: QueryTypes.RAW,
      },
    )
    console.log(reusltados)
    await SendEmail(email, nombre, {asunto:"Confirmar usuario", body:`<h1>Felicidades tu usuario fue creado</h1>`})
    res.status(200).json({ created: true, error: null })
  } catch (error) {
    res.status(404).json({ created: false, error: error })
  }
}

export async function ChangePass(req: Request, res: Response) {
  let { email } = req.body
  let ruid = randomUUID()
  try {
    let [resultados]: usuariosAtt[] = await sequelize.query(
      "SELECT * FROM usuarios WHERE correo_electronico = :email",
      {
        replacements: { email: email },
        type: QueryTypes.SELECT,
      },
    )
    let url = `${req.protocol}://${req.host}${req.baseUrl}/cpass_confirm/${ruid}`
    await keyDB.set(
      ruid,
      `${email}-${resultados.idusuarios}-${new Date().getTime()}`,
    )
    if (resultados === undefined) throw new Error("Usuario no encontrado")
    //TODO: Enviar la url a el email por ahora se regresa en el response
    res.status(200).json({ url })
  } catch (error) {
    res.status(400).json({ error })
  }
}
export async function CpassC(req: Request, res: Response) {
  const { key } = req.params
  console.log(key, await keyDB.exists(key))
  try {
    if (!key || (await keyDB.exists(key)) === 0)
      throw new Error("Llave erronea")
    await keyDB.del(key)
    //TODO: redireccionar a frontend donde se cambiara la password
    res.status(300).redirect("https://google.com")
  } catch (error) {
    res.status(400).json({ error })
  }
}

export async function ChanginPass(req: Request, res: Response) {
  const { newpass } = req.body
  const { id } = req.params
  console.log(newpass, id)
  try {
    let validpass = PassVal.parse(newpass)
    const passH = await HassPass(validpass, 10)
    const [resultado] = await sequelize.query(
      "EXEC ActualizarCampoUsuario :id, :Campo, :NuevoValor",
      {
        replacements: {
          id,
          Campo: "password",
          NuevoValor: passH,
        },
        type: QueryTypes.RAW,
      },
    )
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    res.status(404).json({ error })
  }
}
