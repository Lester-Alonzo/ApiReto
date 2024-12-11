import type { Sequelize } from "sequelize"
import { Auditoria as _Auditoria } from "./Auditoria"
import type {
  AuditoriaAttributes,
  AuditoriaCreationAttributes,
} from "./Auditoria"
import { CategoriaProductos as _CategoriaProductos } from "./CategoriaProductos"
import type {
  CategoriaProductosAttributes,
  CategoriaProductosCreationAttributes,
} from "./CategoriaProductos"
import { Clientes as _Clientes } from "./Clientes"
import type { ClientesAttributes, ClientesCreationAttributes } from "./Clientes"
import { Orden as _Orden } from "./Orden"
import type { OrdenAttributes, OrdenCreationAttributes } from "./Orden"
import { OrdenDetalles as _OrdenDetalles } from "./OrdenDetalles"
import type {
  OrdenDetallesAttributes,
  OrdenDetallesCreationAttributes,
} from "./OrdenDetalles"
import { Productos as _Productos } from "./Productos"
import type {
  ProductosAttributes,
  ProductosCreationAttributes,
} from "./Productos"
import { estados as _estados } from "./estados"
import type { estadosAttributes, estadosCreationAttributes } from "./estados"
import { rol as _rol } from "./rol"
import type { rolAttributes, rolCreationAttributes } from "./rol"
import { usuarios as _usuarios } from "./usuarios"
import type { usuariosAttributes, usuariosCreationAttributes } from "./usuarios"

export {
  _Auditoria as Auditoria,
  _CategoriaProductos as CategoriaProductos,
  _Clientes as Clientes,
  _Orden as Orden,
  _OrdenDetalles as OrdenDetalles,
  _Productos as Productos,
  _estados as estados,
  _rol as rol,
  _usuarios as usuarios,
}

export type {
  AuditoriaAttributes,
  AuditoriaCreationAttributes,
  CategoriaProductosAttributes,
  CategoriaProductosCreationAttributes,
  ClientesAttributes,
  ClientesCreationAttributes,
  OrdenAttributes,
  OrdenCreationAttributes,
  OrdenDetallesAttributes,
  OrdenDetallesCreationAttributes,
  ProductosAttributes,
  ProductosCreationAttributes,
  estadosAttributes,
  estadosCreationAttributes,
  rolAttributes,
  rolCreationAttributes,
  usuariosAttributes,
  usuariosCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const Auditoria = _Auditoria.initModel(sequelize)
  const CategoriaProductos = _CategoriaProductos.initModel(sequelize)
  const Clientes = _Clientes.initModel(sequelize)
  const Orden = _Orden.initModel(sequelize)
  const OrdenDetalles = _OrdenDetalles.initModel(sequelize)
  const Productos = _Productos.initModel(sequelize)
  const estados = _estados.initModel(sequelize)
  const rol = _rol.initModel(sequelize)
  const usuarios = _usuarios.initModel(sequelize)

  Productos.belongsTo(CategoriaProductos, {
    as: "CategoriaProductos_IDCategoria_CategoriaProducto",
    foreignKey: "CategoriaProductos_IDCategoria",
  })
  CategoriaProductos.hasMany(Productos, {
    as: "Productos",
    foreignKey: "CategoriaProductos_IDCategoria",
  })
  usuarios.belongsTo(Clientes, {
    as: "Clientes_idClientes_Cliente",
    foreignKey: "Clientes_idClientes",
  })
  Clientes.hasMany(usuarios, {
    as: "usuarios",
    foreignKey: "Clientes_idClientes",
  })
  OrdenDetalles.belongsTo(Orden, {
    as: "Orden_idOrden_Orden",
    foreignKey: "Orden_idOrden",
  })
  Orden.hasMany(OrdenDetalles, {
    as: "OrdenDetalles",
    foreignKey: "Orden_idOrden",
  })
  OrdenDetalles.belongsTo(Productos, {
    as: "Productos_idProductos_Producto",
    foreignKey: "Productos_idProductos",
  })
  Productos.hasMany(OrdenDetalles, {
    as: "OrdenDetalles",
    foreignKey: "Productos_idProductos",
  })
  CategoriaProductos.belongsTo(estados, {
    as: "estados_idestados_estado",
    foreignKey: "estados_idestados",
  })
  estados.hasMany(CategoriaProductos, {
    as: "CategoriaProductos",
    foreignKey: "estados_idestados",
  })
  Orden.belongsTo(estados, {
    as: "estados_idestados_estado",
    foreignKey: "estados_idestados",
  })
  estados.hasMany(Orden, { as: "Ordens", foreignKey: "estados_idestados" })
  Productos.belongsTo(estados, {
    as: "estados_idestados_estado",
    foreignKey: "estados_idestados",
  })
  estados.hasMany(Productos, {
    as: "Productos",
    foreignKey: "estados_idestados",
  })
  usuarios.belongsTo(estados, {
    as: "estados_idestados_estado",
    foreignKey: "estados_idestados",
  })
  estados.hasMany(usuarios, { as: "usuarios", foreignKey: "estados_idestados" })
  usuarios.belongsTo(rol, { as: "rol_idrol_rol", foreignKey: "rol_idrol" })
  rol.hasMany(usuarios, { as: "usuarios", foreignKey: "rol_idrol" })
  CategoriaProductos.belongsTo(usuarios, {
    as: "usuarios_idusuarios_usuario",
    foreignKey: "usuarios_idusuarios",
  })
  usuarios.hasMany(CategoriaProductos, {
    as: "CategoriaProductos",
    foreignKey: "usuarios_idusuarios",
  })
  Orden.belongsTo(usuarios, {
    as: "usuarios_idusuarios_usuario",
    foreignKey: "usuarios_idusuarios",
  })
  usuarios.hasMany(Orden, { as: "Ordens", foreignKey: "usuarios_idusuarios" })
  Productos.belongsTo(usuarios, {
    as: "usuarios_idusuarios_usuario",
    foreignKey: "usuarios_idusuarios",
  })
  usuarios.hasMany(Productos, {
    as: "Productos",
    foreignKey: "usuarios_idusuarios",
  })

  return {
    Auditoria: Auditoria,
    CategoriaProductos: CategoriaProductos,
    Clientes: Clientes,
    Orden: Orden,
    OrdenDetalles: OrdenDetalles,
    Productos: Productos,
    estados: estados,
    rol: rol,
    usuarios: usuarios,
  }
}
