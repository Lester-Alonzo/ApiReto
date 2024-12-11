import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type {
  CategoriaProductos,
  CategoriaProductosId,
} from "./CategoriaProductos"
import type { Clientes, ClientesId } from "./Clientes"
import type { Orden, OrdenId } from "./Orden"
import type { Productos, ProductosId } from "./Productos"
import type { estados, estadosId } from "./estados"
import type { rol, rolId } from "./rol"

export interface usuariosAttributes {
  idusuarios: number
  rol_idrol: number
  estados_idestados: number
  correo_electronico: string
  nombre_completo: string
  password: string
  telefono?: string
  fecha_nacimiento?: string
  fecha_creacion?: Date
  Clientes_idClientes?: number
}

export type usuariosPk = "idusuarios"
export type usuariosId = usuarios[usuariosPk]
export type usuariosOptionalAttributes =
  | "idusuarios"
  | "telefono"
  | "fecha_nacimiento"
  | "fecha_creacion"
  | "Clientes_idClientes"
export type usuariosCreationAttributes = Optional<
  usuariosAttributes,
  usuariosOptionalAttributes
>

export class usuarios
  extends Model<usuariosAttributes, usuariosCreationAttributes>
  implements usuariosAttributes
{
  idusuarios!: number
  rol_idrol!: number
  estados_idestados!: number
  correo_electronico!: string
  nombre_completo!: string
  password!: string
  telefono?: string
  fecha_nacimiento?: string
  fecha_creacion?: Date
  Clientes_idClientes?: number

  // usuarios belongsTo Clientes via Clientes_idClientes
  Clientes_idClientes_Cliente!: Clientes
  getClientes_idClientes_Cliente!: Sequelize.BelongsToGetAssociationMixin<Clientes>
  setClientes_idClientes_Cliente!: Sequelize.BelongsToSetAssociationMixin<
    Clientes,
    ClientesId
  >
  createClientes_idClientes_Cliente!: Sequelize.BelongsToCreateAssociationMixin<Clientes>
  // usuarios belongsTo estados via estados_idestados
  estados_idestados_estado!: estados
  getEstados_idestados_estado!: Sequelize.BelongsToGetAssociationMixin<estados>
  setEstados_idestados_estado!: Sequelize.BelongsToSetAssociationMixin<
    estados,
    estadosId
  >
  createEstados_idestados_estado!: Sequelize.BelongsToCreateAssociationMixin<estados>
  // usuarios belongsTo rol via rol_idrol
  rol_idrol_rol!: rol
  getRol_idrol_rol!: Sequelize.BelongsToGetAssociationMixin<rol>
  setRol_idrol_rol!: Sequelize.BelongsToSetAssociationMixin<rol, rolId>
  createRol_idrol_rol!: Sequelize.BelongsToCreateAssociationMixin<rol>
  // usuarios hasMany CategoriaProductos via usuarios_idusuarios
  CategoriaProductos!: CategoriaProductos[]
  getCategoriaProductos!: Sequelize.HasManyGetAssociationsMixin<CategoriaProductos>
  setCategoriaProductos!: Sequelize.HasManySetAssociationsMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  addCategoriaProducto!: Sequelize.HasManyAddAssociationMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  addCategoriaProductos!: Sequelize.HasManyAddAssociationsMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  createCategoriaProducto!: Sequelize.HasManyCreateAssociationMixin<CategoriaProductos>
  removeCategoriaProducto!: Sequelize.HasManyRemoveAssociationMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  removeCategoriaProductos!: Sequelize.HasManyRemoveAssociationsMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  hasCategoriaProducto!: Sequelize.HasManyHasAssociationMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  hasCategoriaProductos!: Sequelize.HasManyHasAssociationsMixin<
    CategoriaProductos,
    CategoriaProductosId
  >
  countCategoriaProductos!: Sequelize.HasManyCountAssociationsMixin
  // usuarios hasMany Orden via usuarios_idusuarios
  Ordens!: Orden[]
  getOrdens!: Sequelize.HasManyGetAssociationsMixin<Orden>
  setOrdens!: Sequelize.HasManySetAssociationsMixin<Orden, OrdenId>
  addOrden!: Sequelize.HasManyAddAssociationMixin<Orden, OrdenId>
  addOrdens!: Sequelize.HasManyAddAssociationsMixin<Orden, OrdenId>
  createOrden!: Sequelize.HasManyCreateAssociationMixin<Orden>
  removeOrden!: Sequelize.HasManyRemoveAssociationMixin<Orden, OrdenId>
  removeOrdens!: Sequelize.HasManyRemoveAssociationsMixin<Orden, OrdenId>
  hasOrden!: Sequelize.HasManyHasAssociationMixin<Orden, OrdenId>
  hasOrdens!: Sequelize.HasManyHasAssociationsMixin<Orden, OrdenId>
  countOrdens!: Sequelize.HasManyCountAssociationsMixin
  // usuarios hasMany Productos via usuarios_idusuarios
  Productos!: Productos[]
  getProductos!: Sequelize.HasManyGetAssociationsMixin<Productos>
  setProductos!: Sequelize.HasManySetAssociationsMixin<Productos, ProductosId>
  addProducto!: Sequelize.HasManyAddAssociationMixin<Productos, ProductosId>
  addProductos!: Sequelize.HasManyAddAssociationsMixin<Productos, ProductosId>
  createProducto!: Sequelize.HasManyCreateAssociationMixin<Productos>
  removeProducto!: Sequelize.HasManyRemoveAssociationMixin<
    Productos,
    ProductosId
  >
  removeProductos!: Sequelize.HasManyRemoveAssociationsMixin<
    Productos,
    ProductosId
  >
  hasProducto!: Sequelize.HasManyHasAssociationMixin<Productos, ProductosId>
  hasProductos!: Sequelize.HasManyHasAssociationsMixin<Productos, ProductosId>
  countProductos!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof usuarios {
    return sequelize.define(
      "usuarios",
      {
        idusuarios: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        rol_idrol: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "rol",
            key: "idrol",
          },
        },
        estados_idestados: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "estados",
            key: "idestados",
          },
        },
        correo_electronico: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: "UQ__usuarios__5B8A0682E971C049",
        },
        nombre_completo: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        telefono: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
        fecha_nacimiento: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn("getdate"),
        },
        Clientes_idClientes: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "Clientes",
            key: "idClientes",
          },
        },
      },
      {
        tableName: "usuarios",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__usuarios__500509C0A755E9CD",
            unique: true,
            fields: [{ name: "idusuarios" }],
          },
          {
            name: "UQ__usuarios__5B8A0682E971C049",
            unique: true,
            fields: [{ name: "correo_electronico" }],
          },
        ],
      },
    ) as typeof usuarios
  }
}
