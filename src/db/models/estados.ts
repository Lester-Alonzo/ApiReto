import { DataTypes, type Sequelize, Model } from "@sequelize/core"

interface EstadosAtt {
  idestados?: number
  nombre: string
}
interface EstadosInstance extends Model<EstadosAtt, EstadosAtt>, EstadosAtt {}

export function EstadosModel(sequelize: Sequelize) {
  const estados = sequelize.define<EstadosInstance>(
    "estados",
    {
      idestados: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "estados",
      timestamps: false,
    },
  )
  return estados
}
