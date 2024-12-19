import express from "express"
import cors from "cors"
import { serve as SWServe, setup as SWSetup } from "swagger-ui-express"
import { swaggerDosc } from "../swaggerDef"
import { auth } from "./routes/auth.route"
import { producto } from "./routes/producto.route"
import { rol } from "./routes/rol.route"
import { estado } from "./routes/estado.route"
import { CatProdu } from "./routes/categoriaproductos.route"
import { Orden } from "./routes/orden.route"
import { Clientes } from "./routes/clientes.route"
import helmet from 'helmet'
// import {models} from './db/mssql'
// import {Express} from './types'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use("/api-docs", SWServe, SWSetup(swaggerDosc))

//models
// app.use((req:Express.RequestE, res, next) => {
//     req.context = {
//         models,
//         me:""
//     }
// })

//routes

app.use("/auth", auth)
app.use("/productos", producto)
app.use("/rol", rol)
app.use("/estado", estado)
app.use("/categoria", CatProdu)
app.use("/ordend", Orden)
app.use("/clientes", Clientes)

export { app }
