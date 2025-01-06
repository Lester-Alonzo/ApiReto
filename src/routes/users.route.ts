import {Router} from 'express'
import {ActivarA, DesactivarA, MiddlewareAdmins, RegisterUser, TodosLosAdmins, UnAdmin} from '../controllers/users'

const Admins = Router()

Admins.use(MiddlewareAdmins)

Admins.get("/all", TodosLosAdmins)
Admins.get("/one/:id", UnAdmin )
Admins.delete("/delad/:id", DesactivarA)
Admins.delete("/avtid/:id", ActivarA)
Admins.post("/create", RegisterUser)

export {Admins}