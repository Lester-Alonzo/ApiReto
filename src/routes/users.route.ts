import {Router} from 'express'
import {ActivarA, DesactivarA, MiddlewareAdmins, RegisterUser, TodosLosAdmins, UnAdmin, UpdateAdmin} from '../controllers/users'

const Admins = Router()

Admins.use(MiddlewareAdmins)

Admins.get("/all", TodosLosAdmins)
Admins.get("/one/:id", UnAdmin )
Admins.delete("/delad/:id", DesactivarA)
Admins.get("/avtid/:id", ActivarA)
Admins.post("/create", RegisterUser)
Admins.put("/actualizar/:id", UpdateAdmin)
//Admins.put("//:id", UpdateAdmin)

export {Admins}