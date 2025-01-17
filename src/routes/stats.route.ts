import {Router} from 'express'
import {MiddlewareStats, Ordenes, ProductosConStock, TopClientes, TopProductos} from '../controllers/stats'

const Stats = Router()

Stats.use(MiddlewareStats)

Stats.get("/ativeprodu", ProductosConStock)
Stats.get("/totalmes", Ordenes)
Stats.get("/topclientes", TopClientes)
Stats.get("/topproductos", TopProductos)

export {Stats}

