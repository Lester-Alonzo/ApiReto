import { Router } from "express"
import multer from "multer"
import {
  ListAll,
  CraerProducto,
  UpdateProduct,
  MiddlewareProduct,
  EliminarProducto,
} from "../controllers/producto"
const producto = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

producto.get("/list", MiddlewareProduct, ListAll)
producto.post(
  "/create",
  MiddlewareProduct,
  upload.single("foto"),
  CraerProducto,
)
producto.put("/editar/:id", MiddlewareProduct, UpdateProduct)
producto.delete("eliminar/:id", MiddlewareProduct, EliminarProducto)

export { producto }
