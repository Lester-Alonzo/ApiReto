import express from "express"
import cors from "cors"
import { serve as SWServe, setup as SWSetup } from "swagger-ui-express"
import { swaggerDosc } from "../swaggerDef"
import { auth } from "./routes/auth.route"
import { producto } from "./routes/producto.route"
// import {models} from './db/mssql'
// import {Express} from './types'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

export { app }
