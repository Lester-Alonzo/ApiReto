import { Sequelize } from "@sequelize/core"
import { MsSqlDialect } from "@sequelize/mssql"
//modelos
import { RolModel } from "./models/rol"
import { EstadosModel } from "./models/estados"
import {CateProductModel} from './models/categoria_producto'
import {ClientesModel} from './models/clientes'
import {OrdenModel} from './models/orden'
import {OdenDetalleModel} from './models/orden_detalle'
import {ProductoModel} from './models/producto'
import {usuariosModel} from './models/usuarios'

export const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: "localhost",
  port: 1433,
  database: "EcomerceV3",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "L@grasaesgrasa2025", //TODO:Cambiar Contrasena
    },
  },
  encrypt: true,
  trustServerCertificate: true,
})
export const models = {
 rol: RolModel(sequelize),
 estados: EstadosModel(sequelize),
 clientes: ClientesModel(sequelize),
 usuarios: usuariosModel(sequelize),
 categoriaProductos: CateProductModel(sequelize),
 orden:OrdenModel(sequelize),
 ordenDetalle:OdenDetalleModel(sequelize),
 productos: ProductoModel(sequelize)
}


// const defineAssociations = () => {
//   //relaciones de usuario
//   models.usuarios.belongsTo(models.rol, {foreignKey:"rol_idrol", as:"rol"})

//   models.usuarios.belongsTo(models.estados, {foreignKey:"estados_idestados", as:"estados"})
//   models.usuarios.hasMany(models.clientes, {as:"Clientes"})

//   //relaciones de categoria Productos
//   models.categoriaProductos.hasMany(models.usuarios, {as:"CategoriaProductos"})
//   models.categoriaProductos.belongsTo(models.estados, {foreignKey:"estados_idestados", as:"estados"})

//   //relaciones Productos
//   models.productos.hasMany(models.categoriaProductos, {foreignKey:"idCategoriaProductos",as:"CategoriaProductos"})
//   models.productos.belongsTo(models.usuarios, {foreignKey:"usuarios_idusuarios", as:"usuarios"})
// TODO: falta muchas relaciones de ser necesarios en el futuro
// }

//defineAssociations()

async function SQLServerPing() {
  try {
    const respons = await sequelize.authenticate()
    console.log(respons)
  } catch (error) {
    console.error(error)
  }
}
;(async () => {
  await sequelize.sync({ alter: false, force: false })
})()
