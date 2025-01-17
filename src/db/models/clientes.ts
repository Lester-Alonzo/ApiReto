import { DataTypes, type Sequelize, Model } from "@sequelize/core"

export interface ClientesAtt {
  idClientes?: number
  razon_social?: string
  nombre_comercial: string
  direccion_entrega: string
  telefono: string
  email: string
  password:string
  estado_idEstado: number
}
interface ClientesInstance
  extends Model<ClientesAtt, ClientesAtt>,
    ClientesAtt {}

export function ClientesModel(sequelize: Sequelize) {
  const Clientes = sequelize.define<ClientesInstance>(
    "Clientes",
    {
      idClientes: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      razon_social: {
        type: DataTypes.STRING(245),
        allowNull: true,
      },
      nombre_comercial: {
        type: DataTypes.STRING(34),
        allowNull: false,
        unique: true,
      },
      direccion_entrega: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(45),
        unique: true,
        allowNull: false,
      },
      password:{
        type: DataTypes.STRING(100),
        allowNull:false
      },
      estado_idEstado:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
          table:"estados",
          key:"idestados"
        }
      }
    },
    {
      tableName: "Clientes",
      timestamps: false,
    },
  )
  return Clientes
}
