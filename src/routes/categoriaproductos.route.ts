import {Router} from 'express'
import {MiddlewareCP, CrearCategoria, EditarCategoria, TodosLosCP} from '../controllers/categoriaproductos'

const CatProdu = Router()

CatProdu.use(MiddlewareCP)

CatProdu.get("/all", TodosLosCP)
CatProdu.post("/crear", CrearCategoria)
CatProdu.put("/editar/:id", EditarCategoria)
//rol.delete("/eliminar/:id")

export {CatProdu}