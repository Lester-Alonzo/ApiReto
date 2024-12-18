import { Router } from "express"
import { ListAll, MiddlewareProducts, CraerProducto, UpdateProduct } from "../controllers/producto"
const producto = Router()

producto.get("/list", MiddlewareProducts,ListAll)
producto.post("/create", MiddlewareProducts, CraerProducto)
producto.put("/editar/:id", MiddlewareProducts, UpdateProduct)
// producto.delete("eliminar/:id", MiddlewareProducts,)

export { producto }
