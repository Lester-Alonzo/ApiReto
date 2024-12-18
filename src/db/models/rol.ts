import { DataTypes, type Sequelize, Model } from "@sequelize/core"
import {usuariosModel} from './usuarios'

interface RolAtt {
  idrol?: number
  nombre: string
}
interface RolInstace extends Model<RolAtt, RolAtt>, RolAtt {}

export function RolModel(sequelize: Sequelize) {
  const rol = sequelize.define<RolInstace>(
    "rol",
    {
      idrol: {
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
      tableName: "rol",
      timestamps: false,
    },
  )
  //rol.hasMany(usuariosModel(sequelize), {as:"usuarios"})
  return rol
}
