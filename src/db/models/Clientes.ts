import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { usuarios, usuariosId } from "./usuarios"

export interface ClientesAttributes {
  idClientes: number
  razon_social?: string
  nombre_comercial: string
  direccion_entrega?: string
  telefono: string
  email: string
}

export type ClientesPk = "idClientes"
export type ClientesId = Clientes[ClientesPk]
export type ClientesOptionalAttributes =
  | "idClientes"
  | "razon_social"
  | "direccion_entrega"
export type ClientesCreationAttributes = Optional<
  ClientesAttributes,
  ClientesOptionalAttributes
>

export class Clientes
  extends Model<ClientesAttributes, ClientesCreationAttributes>
  implements ClientesAttributes
{
  idClientes!: number
  razon_social?: string
  nombre_comercial!: string
  direccion_entrega?: string
  telefono!: string
  email!: string

  // Clientes hasMany usuarios via Clientes_idClientes
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Clientes {
    return sequelize.define(
      "Clientes",
      {
        idClientes: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        razon_social: {
          type: DataTypes.STRING(245),
          allowNull: true,
        },
        nombre_comercial: {
          type: DataTypes.STRING(34),
          allowNull: false,
          unique: "UQ__Clientes__ABF5AA73B7AB9948",
        },
        direccion_entrega: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
        telefono: {
          type: DataTypes.STRING(45),
          allowNull: false,
          unique: "UQ__Clientes__2A16D94531F65CB1",
        },
        email: {
          type: DataTypes.STRING(45),
          allowNull: false,
          unique: "UQ__Clientes__AB6E6164BA2A6A35",
        },
      },
      {
        tableName: "Clientes",
        schema: "dbo",
        timestamps: false,
        indexes: [
          {
            name: "PK__Clientes__470BDBA08DF49B36",
            unique: true,
            fields: [{ name: "idClientes" }],
          },
          {
            name: "UQ__Clientes__2A16D94531F65CB1",
            unique: true,
            fields: [{ name: "telefono" }],
          },
          {
            name: "UQ__Clientes__AB6E6164BA2A6A35",
            unique: true,
            fields: [{ name: "email" }],
          },
          {
            name: "UQ__Clientes__ABF5AA73B7AB9948",
            unique: true,
            fields: [{ name: "nombre_comercial" }],
          },
        ],
      },
    ) as typeof Clientes
  }
}
