import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type {
  CategoriaProductos,
  CategoriaProductosId,
} from "./CategoriaProductos"
import type { Orden, OrdenId } from "./Orden"
import type { Productos, ProductosId } from "./Productos"
import type { usuarios, usuariosId } from "./usuarios"

export interface estadosAttributes {
  idestados: number
  nombre: string
}

export type estadosPk = "idestados"
export type estadosId = estados[estadosPk]
export type estadosOptionalAttributes = "idestados"
export type estadosCreationAttributes = Optional<
  estadosAttributes,
  estadosOptionalAttributes
>

export class estados
  extends Model<estadosAttributes, estadosCreationAttributes>
  implements estadosAttributes
{
  idestados!: number
  nombre!: string

  // estados hasMany CategoriaProductos via estados_idestados
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
  // estados hasMany Orden via estados_idestados
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
  // estados hasMany Productos via estados_idestados
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
  // estados hasMany usuarios via estados_idestados
  usuarios!: usuarios[]
  getUsuarios!: Sequelize.HasManyGetAssociationsMixin<usuarios>
  setUsuarios!: Sequelize.HasManySetAssociationsMixin<usuarios, usuariosId>
  addUsuario!: Sequelize.HasManyAddAssociationMixin<usuarios, usuariosId>
  addUsuarios!: Sequelize.HasManyAddAssociationsMixin<usuarios, usuariosId>
  createUsuario!: Sequelize.HasManyCreateAssociationMixin<usuarios>
  removeUsuario!: Sequelize.HasManyRemoveAssociationMixin<usuarios, usuariosId>
  removeUsuarios!: Sequelize.HasManyRemoveAssociationsMixin<
    usuarios,
    usuariosId
  >
  hasUsuario!: Sequelize.HasManyHasAssociationMixin<usuarios, usuariosId>
  hasUsuarios!: Sequelize.HasManyHasAssociationsMixin<usuarios, usuariosId>
  countUsuarios!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof estados {
    return sequelize.define(
      "estados",
      {
        idestados: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
      },
      {
        tableName: "estados",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__estados__98CC60B6397B9A90",
            unique: true,
            fields: [{ name: "idestados" }],
          },
        ],
      },
    ) as typeof estados
  }
}
