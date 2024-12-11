import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { OrdenDetalles, OrdenDetallesId } from "./OrdenDetalles"
import type { estados, estadosId } from "./estados"
import type { usuarios, usuariosId } from "./usuarios"

export interface OrdenAttributes {
  idOrden: number
  usuarios_idusuarios: number
  estados_idestados: number
  fecha_creacion?: Date
  nombre_completo: string
  direccion: string
  telefono: string
  correo_electronico: string
  fecha_entrega?: string
  total_orden: number
}

export type OrdenPk = "idOrden"
export type OrdenId = Orden[OrdenPk]
export type OrdenOptionalAttributes =
  | "idOrden"
  | "fecha_creacion"
  | "fecha_entrega"
export type OrdenCreationAttributes = Optional<
  OrdenAttributes,
  OrdenOptionalAttributes
>

export class Orden
  extends Model<OrdenAttributes, OrdenCreationAttributes>
  implements OrdenAttributes
{
  idOrden!: number
  usuarios_idusuarios!: number
  estados_idestados!: number
  fecha_creacion?: Date
  nombre_completo!: string
  direccion!: string
  telefono!: string
  correo_electronico!: string
  fecha_entrega?: string
  total_orden!: number

  // Orden hasMany OrdenDetalles via Orden_idOrden
  OrdenDetalles!: OrdenDetalles[]
  getOrdenDetalles!: Sequelize.HasManyGetAssociationsMixin<OrdenDetalles>
  setOrdenDetalles!: Sequelize.HasManySetAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  addOrdenDetalle!: Sequelize.HasManyAddAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  addOrdenDetalles!: Sequelize.HasManyAddAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  createOrdenDetalle!: Sequelize.HasManyCreateAssociationMixin<OrdenDetalles>
  removeOrdenDetalle!: Sequelize.HasManyRemoveAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  removeOrdenDetalles!: Sequelize.HasManyRemoveAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  hasOrdenDetalle!: Sequelize.HasManyHasAssociationMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  hasOrdenDetalles!: Sequelize.HasManyHasAssociationsMixin<
    OrdenDetalles,
    OrdenDetallesId
  >
  countOrdenDetalles!: Sequelize.HasManyCountAssociationsMixin
  // Orden belongsTo estados via estados_idestados
  estados_idestados_estado!: estados
  getEstados_idestados_estado!: Sequelize.BelongsToGetAssociationMixin<estados>
  setEstados_idestados_estado!: Sequelize.BelongsToSetAssociationMixin<
    estados,
    estadosId
  >
  createEstados_idestados_estado!: Sequelize.BelongsToCreateAssociationMixin<estados>
  // Orden belongsTo usuarios via usuarios_idusuarios
  usuarios_idusuarios_usuario!: usuarios
  getUsuarios_idusuarios_usuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>
  setUsuarios_idusuarios_usuario!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >
  createUsuarios_idusuarios_usuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>

  static initModel(sequelize: Sequelize.Sequelize): typeof Orden {
    return sequelize.define(
      "Orden",
      {
        idOrden: {
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
        nombre_completo: {
          type: DataTypes.STRING(80),
          allowNull: false,
        },
        direccion: {
          type: DataTypes.STRING(545),
          allowNull: false,
        },
        telefono: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        correo_electronico: {
          type: DataTypes.STRING(70),
          allowNull: false,
        },
        fecha_entrega: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        total_orden: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        tableName: "Orden",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__Orden__C8AAF6F33CA5FACB",
            unique: true,
            fields: [{ name: "idOrden" }],
          },
        ],
      },
    ) as typeof Orden
  }
}
