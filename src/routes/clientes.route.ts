import { Router } from "express"
import {
  ConfirmLogin,
  Crear,
  Login,
  MiddlewareClientes,
  TodosLosClientes,
} from "../controllers/clientes"

const Clientes = Router()

Clientes.use(MiddlewareClientes)

Clientes.get("/all", TodosLosClientes)
Clientes.post("/login", Login)
Clientes.get("/confirmlogin/:key", ConfirmLogin)
Clientes.post("/crear", Crear)

export { Clientes }
