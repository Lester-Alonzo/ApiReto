import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { Productos, ProductosId } from "./Productos"
import type { estados, estadosId } from "./estados"
import type { usuarios, usuariosId } from "./usuarios"

export interface CategoriaProductosAttributes {
  idCategoriaProductos: number
  usuarios_idusuarios: number
  nombre: string
  estados_idestados: number
  fecha_creacion?: Date
}

export type CategoriaProductosPk = "idCategoriaProductos"
export type CategoriaProductosId = CategoriaProductos[CategoriaProductosPk]
export type CategoriaProductosOptionalAttributes =
  | "idCategoriaProductos"
  | "fecha_creacion"
export type CategoriaProductosCreationAttributes = Optional<
  CategoriaProductosAttributes,
  CategoriaProductosOptionalAttributes
>

export class CategoriaProductos
  extends Model<
    CategoriaProductosAttributes,
    CategoriaProductosCreationAttributes
  >
  implements CategoriaProductosAttributes
{
  idCategoriaProductos!: number
  usuarios_idusuarios!: number
  nombre!: string
  estados_idestados!: number
  fecha_creacion?: Date

  // CategoriaProductos hasMany Productos via CategoriaProductos_IDCategoria
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
  // CategoriaProductos belongsTo estados via estados_idestados
  estados_idestados_estado!: estados
  getEstados_idestados_estado!: Sequelize.BelongsToGetAssociationMixin<estados>
  setEstados_idestados_estado!: Sequelize.BelongsToSetAssociationMixin<
    estados,
    estadosId
  >
  createEstados_idestados_estado!: Sequelize.BelongsToCreateAssociationMixin<estados>
  // CategoriaProductos belongsTo usuarios via usuarios_idusuarios
  usuarios_idusuarios_usuario!: usuarios
  getUsuarios_idusuarios_usuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>
  setUsuarios_idusuarios_usuario!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >
  createUsuarios_idusuarios_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>

  static initModel(sequelize: Sequelize.Sequelize): typeof CategoriaProductos {
    return sequelize.define(
      "CategoriaProductos",
      {
        idCategoriaProductos: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        estados_idestados: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "estados",
            key: "idestados",
          },
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn("getdate"),
        },
      },
      {
        tableName: "CategoriaProductos",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__Categori__4A736D2117DC3E0B",
            unique: true,
            fields: [{ name: "idCategoriaProductos" }],
          },
        ],
      },
    ) as typeof CategoriaProductos
  }
}
