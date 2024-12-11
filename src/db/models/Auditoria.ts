import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"

export interface AuditoriaAttributes {
  idAuditoria: number
  tabla?: string
  accion?: string
  fecha?: Date
  idRegistro?: number
  descripcion?: string
}

export type AuditoriaPk = "idAuditoria"
export type AuditoriaId = Auditoria[AuditoriaPk]
export type AuditoriaOptionalAttributes =
  | "idAuditoria"
  | "tabla"
  | "accion"
  | "fecha"
  | "idRegistro"
  | "descripcion"
export type AuditoriaCreationAttributes = Optional<
  AuditoriaAttributes,
  AuditoriaOptionalAttributes
>

export class Auditoria
  extends Model<AuditoriaAttributes, AuditoriaCreationAttributes>
  implements AuditoriaAttributes
{
  idAuditoria!: number
  tabla?: string
  accion?: string
  fecha?: Date
  idRegistro?: number
  descripcion?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof Auditoria {
    return sequelize.define(
      "Auditoria",
      {
        idAuditoria: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        tabla: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        accion: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        fecha: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn("getdate"),
        },
        idRegistro: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: "Auditoria",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__Auditori__F1F3070143E2AF1A",
            unique: true,
            fields: [{ name: "idAuditoria" }],
          },
        ],
      },
    ) as typeof Auditoria
  }
}
