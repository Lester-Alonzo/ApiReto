import { DataTypes, type Sequelize, Model } from "@sequelize/core"

interface OrdenDetalleAtt {
  idOrdenDetalles?: number
  Orden_idOrden: number
  Productos_idProductos: number
  cantidad: number
  precio: number
  subtotal: number
}
interface OrdenDetalleInstance
  extends Model<OrdenDetalleAtt, OrdenDetalleAtt>,
    OrdenDetalleAtt {}

export function OdenDetalleModel(sequelize: Sequelize) {
  const OrdenDetalle = sequelize.define<OrdenDetalleInstance>(
    "OrdenDetalles",
    {
      idOrdenDetalles: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Orden_idOrden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          table: "Orden",
          key: "idOrden",
        },
      },
      Productos_idProductos: {
        type: DataTypes.INTEGER,
        references: {
          table: "Productos",
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
      timestamps: false,
    },
  )
  return OrdenDetalle
}
