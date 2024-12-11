import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { usuarios, usuariosId } from "./usuarios"

export interface rolAttributes {
  idrol: number
  nombre: string
}

export type rolPk = "idrol"
export type rolId = rol[rolPk]
export type rolOptionalAttributes = "idrol"
export type rolCreationAttributes = Optional<
  rolAttributes,
  rolOptionalAttributes
>

export class rol
  extends Model<rolAttributes, rolCreationAttributes>
  implements rolAttributes
{
  idrol!: number
  nombre!: string

  // rol hasMany usuarios via rol_idrol
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

  static initModel(sequelize: Sequelize.Sequelize): typeof rol {
    return sequelize.define(
      "rol",
      {
        idrol: {
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
        tableName: "rol",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__rol__24C6BB205CD366D6",
            unique: true,
            fields: [{ name: "idrol" }],
          },
        ],
      },
    ) as typeof rol
  }
}
