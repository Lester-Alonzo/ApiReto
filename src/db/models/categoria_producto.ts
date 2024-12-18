import { DataTypes, type Sequelize, Model } from "@sequelize/core"

interface cat_prodAtt {
  idCategoriaProductos?: number
  usuarios_idusuarios: number
  nombre: string
  estados_idestados: number
  fecha_creacion?: Date
}
interface catProduInstance
  extends Model<cat_prodAtt, cat_prodAtt>,
    cat_prodAtt {}

export function CateProductModel(sequelize: Sequelize) {
  const catProduct = sequelize.define<catProduInstance>(
    "CategoriaProductos",
    {
      idCategoriaProductos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usuarios_idusuarios: {
        type: DataTypes.INTEGER,
        references: {
          table: "usuarios",
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
          table: "estados",
          key: "idestados",
        },
      },
    },
    {
      tableName: "CategoriaProductos",
      timestamps: false,
    },
  )
  return catProduct
}
