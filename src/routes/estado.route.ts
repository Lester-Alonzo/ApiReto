import { Router } from "express"
import {
  CreateEstado,
  EditarEstado,
  TodosLosEstados,
  MiddlewareEstado,
} from "../controllers/estado"

const estado = Router()

estado.use(MiddlewareEstado)

estado.get("/all", TodosLosEstados)
estado.post("/crear", CreateEstado)
estado.put("/editar/:id", EditarEstado)

export { estado }
