import {Router} from 'express'
import {MiddlewareORden, ListAll, ListOne, Authorizacion, ListAllUser, Crear} from '../controllers/ordend'

const Orden = Router()

Orden.use(MiddlewareORden)

Orden.get("/all", ListAll)
Orden.post("/autorizar/:id", Authorizacion)
Orden.post("/crear", Crear)
Orden.get("/orders", ListAllUser)
Orden.get("/order/:orderid", ListOne)

export {Orden}