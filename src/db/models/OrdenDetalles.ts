import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { Orden, OrdenId } from "./Orden"
import type { Productos, ProductosId } from "./Productos"

export interface OrdenDetallesAttributes {
  idOrdenDetalles: number
  Orden_idOrden: number
  Productos_idProductos: number
  cantidad: number
  precio: number
  subtotal: number
}

export type OrdenDetallesPk = "idOrdenDetalles"
export type OrdenDetallesId = OrdenDetalles[OrdenDetallesPk]
export type OrdenDetallesOptionalAttributes = "idOrdenDetalles"
export type OrdenDetallesCreationAttributes = Optional<
  OrdenDetallesAttributes,
  OrdenDetallesOptionalAttributes
>

export class OrdenDetalles
  extends Model<OrdenDetallesAttributes, OrdenDetallesCreationAttributes>
  implements OrdenDetallesAttributes
{
  idOrdenDetalles!: number
  Orden_idOrden!: number
  Productos_idProductos!: number
  cantidad!: number
  precio!: number
  subtotal!: number

  // OrdenDetalles belongsTo Orden via Orden_idOrden
  Orden_idOrden_Orden!: Orden
  getOrden_idOrden_Orden!: Sequelize.BelongsToGetAssociationMixin<Orden>
  setOrden_idOrden_Orden!: Sequelize.BelongsToSetAssociationMixin<
    Orden,
    OrdenId
  >
  createOrden_idOrden_Orden!: Sequelize.BelongsToCreateAssociationMixin<Orden>
  // OrdenDetalles belongsTo Productos via Productos_idProductos
  Productos_idProductos_Producto!: Productos
  getProductos_idProductos_Producto!: Sequelize.BelongsToGetAssociationMixin<Productos>
  setProductos_idProductos_Producto!: Sequelize.BelongsToSetAssociationMixin<
    Productos,
    ProductosId
  >
  createProductos_idProductos_Producto!: Sequelize.BelongsToCreateAssociationMixin<Productos>

  static initModel(sequelize: Sequelize.Sequelize): typeof OrdenDetalles {
    return sequelize.define(
      "OrdenDetalles",
      {
        idOrdenDetalles: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Orden_idOrden: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Orden",
            key: "idOrden",
          },
        },
        Productos_idProductos: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Productos",
            key: "idProductos",
          },
        },
        cantidad: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        precio: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        tableName: "OrdenDetalles",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__OrdenDet__6ECEF97672356AAA",
            unique: true,
            fields: [{ name: "idOrdenDetalles" }],
          },
        ],
      },
    ) as typeof OrdenDetalles
  }
}
