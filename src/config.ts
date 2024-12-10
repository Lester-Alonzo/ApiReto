import express from 'express'
import cors from 'cors'
import {serve as SWServe, setup as SWSetup} from 'swagger-ui-express'
import {swaggerDosc} from '../swaggerDef'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api-docs", SWServe, SWSetup(swaggerDosc))

export {app}