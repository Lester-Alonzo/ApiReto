import {Router} from 'express'
import {CrearRol,MiddlewareRol,TodosRoles, UpdateRol} from '../controllers/rol'

const rol = Router()

rol.use(MiddlewareRol)

rol.get("/all", TodosRoles)
rol.post("/crear", CrearRol)
rol.put("/editar/:id", UpdateRol)

export {rol}