import type { Request, Response } from "express"
import {Credentials, LoginSche} from '../lib/zchemas'
import { sequelize } from '../db/mssql'
import { QueryTypes } from "@sequelize/core"
import {ComparePassword, HassPass} from '../lib/utils/encry'
import {PswUtils} from '../lib/utils/OTPswd'
import type {usuariosAtt} from '../db/models/usuarios'
import jwt from 'jsonwebtoken'
import {secreKeyJWT} from '../lib/constants'

const PsU = new PswUtils(4, "fasfafadsf")

export async function Login(req: Request, res: Response) {
  const datos = req.body
  try {
    let {email, pass} = LoginSche.parse(datos)
    let [resultados]:usuariosAtt[] = await sequelize.query("SELECT * FROM usuarios WHERE correo_electronico = :email", {
      replacements: {email:email},
      type: QueryTypes.SELECT
    })
    if(resultados === undefined) throw new Error("Usuario no encontrado")
    const rnumber = await PsU.OTPNumber()
    let result = await ComparePassword(pass, resultados.password)
    if(!result) throw new Error("Contrasena incorrecta")
    //TODO: Generar el JWT y el codigo de Session para keydb
  const payload = {
    idu: resultados.idusuarios,
    rol: resultados.rol_idrol,
    estado: resultados.estados_idestados,
    nombre: resultados.nombre_completo
  }
  console.log(payload)
  const token = jwt.sign(payload, secreKeyJWT, {expiresIn:'5h', algorithm:"HS256"})
    console.log(resultados, rnumber, token)
  res.status(200).json({token:token, error:null})
  } catch (error) {
    res.status(404).json({token:null, error:error})
  }
}

export async function Register(req:Request, res:Response) {
  const datos = req.body
try {
  let {email,estado,pass,rol,telefono, nombre} = Credentials.parse(datos)
  const passH = await HassPass(pass, 10)
  let [reusltados] = await sequelize.query("EXEC CrearUsuarios :rol_idrol, :estados_idestados, :correo_electronico, :nombre_completo, :password, :telefono", {
      replacements:{
        rol_idrol: rol,
        estados_idestados:estado,
        correo_electronico:email,
        password:passH,
        telefono,
        nombre_completo:nombre
      }
  })
  console.log(reusltados)
  res.status(200).json({created:true, error:null})
} catch (error) {
  res.status(404).json({created:false, error:error})
}
}