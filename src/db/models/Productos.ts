import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type {
  CategoriaProductos,
  CategoriaProductosId,
} from "./CategoriaProductos"
import type { OrdenDetalles, OrdenDetallesId } from "./OrdenDetalles"
import type { estados, estadosId } from "./estados"
import type { usuarios, usuariosId } from "./usuarios"

export interface ProductosAttributes {
  idProductos: number
  CategoriaProductos_IDCategoria: number
  usuarios_idusuarios: number
  nombre: string
  marca: string
  codigo: string
  stock: number
  estados_idestados: number
  precio: number
  fecha_creacion?: Date
  foto?: any
}

export type ProductosPk = "idProductos"
export type ProductosId = Productos[ProductosPk]
export type ProductosOptionalAttributes =
  | "idProductos"
  | "stock"
  | "fecha_creacion"
  | "foto"
export type ProductosCreationAttributes = Optional<
  ProductosAttributes,
  ProductosOptionalAttributes
>

export class Productos
  extends Model<ProductosAttributes, ProductosCreationAttributes>
  implements ProductosAttributes
{
  idProductos!: number
  CategoriaProductos_IDCategoria!: number
  usuarios_idusuarios!: number
  nombre!: string
  marca!: string
  codigo!: string
  stock!: number
  estados_idestados!: number
  precio!: number
  fecha_creacion?: Date
  foto?: any

  // Productos belongsTo CategoriaProductos via CategoriaProductos_IDCategoria
  CategoriaProductos_IDCategoria_CategoriaProducto!: CategoriaProductos
  getCategoriaProductos_IDCategoria_CategoriaProducto!: Sequelize.BelongsToGetAssociationMixin<CategoriaProductos>
  setCategoriaProductos_IDCategoria_CategoriaProducto!: Sequelize.BelongsToSetAssociationMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  createCategoriaProductos_IDCategoria_CategoriaProducto!: Sequelize.BelongsToCreateAssociationMixin<CategoriaProductos>
  // Productos hasMany OrdenDetalles via Productos_idProductos
  OrdenDetalles!: OrdenDetalles[]
  getOrdenDetalles!: Sequelize.HasManyGetAssociationsMixin<OrdenDetalles>
  setOrdenDetalles!: Sequelize.HasManySetAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  addOrdenDetalle!: Sequelize.HasManyAddAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  addOrdenDetalles!: Sequelize.HasManyAddAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  createOrdenDetalle!: Sequelize.HasManyCreateAssociationMixin<OrdenDetalles>
  removeOrdenDetalle!: Sequelize.HasManyRemoveAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  removeOrdenDetalles!: Sequelize.HasManyRemoveAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  hasOrdenDetalle!: Sequelize.HasManyHasAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  hasOrdenDetalles!: Sequelize.HasManyHasAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  countOrdenDetalles!: Sequelize.HasManyCountAssociationsMixin
  // Productos belongsTo estados via estados_idestados
  estados_idestados_estado!: estados
  getEstados_idestados_estado!: Sequelize.BelongsToGetAssociationMixin<estados>
  setEstados_idestados_estado!: Sequelize.BelongsToSetAssociationMixin<
    estados,
    estadosId
  >
  createEstados_idestados_estado!: Sequelize.BelongsToCreateAssociationMixin<estados>
  // Productos belongsTo usuarios via usuarios_idusuarios
  usuarios_idusuarios_usuario!: usuarios
  getUsuarios_idusuarios_usuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>
  setUsuarios_idusuarios_usuario!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >
  createUsuarios_idusuarios_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>

  static initModel(sequelize: Sequelize.Sequelize): typeof Productos {
    return sequelize.define(
      "Productos",
      {
        idProductos: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        CategoriaProductos_IDCategoria: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "CategoriaProductos",
            key: "idCategoriaProductos",
          },
        },
        usuarios_idusuarios: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "usuarios",
            key: "idusuarios",
          },
        },
        nombre: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        marca: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        codigo: {
          type: DataTypes.STRING(45),
          allowNull: false,
          unique: "UQ__Producto__40F9A2067F037973",
        },
        stock: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        estados_idestados: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "estados",
            key: "idestados",
          },
        },
        precio: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn("getdate"),
        },
        foto: {
          type: DataTypes.BLOB,
          allowNull: true,
        },
      },
      {
        tableName: "Productos",
        schema: "dbo",
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: "PK__Producto__A26E462DD6CC663B",
            unique: true,
            fields: [{ name: "idProductos" }],
          },
          {
            name: "UQ__Producto__40F9A2067F037973",
            unique: true,
            fields: [{ name: "codigo" }],
          },
        ],
      },
    ) as typeof Productos
  }
}
