import { DataTypes, type Sequelize, Model } from "@sequelize/core"

interface OrdenAtt {
  idOrden?: number
  usuarios_idusuarios: number
  estados_idestados: number
  fecha_creacion: Date
  nombre_completo: string
  direccion: string
  telefono: string
  correo_electronico: string
  fecha_entrega?: Date
  total_orden: number
}
interface OrdenInstance extends Model<OrdenAtt, OrdenAtt>, OrdenAtt {}

export function OrdenModel(sequelize: Sequelize) {
  const Orden = sequelize.define<OrdenInstance>(
    "Orden",
    {
      idOrden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarios_idusuarios: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          table: "usuarios",
          key: "idusuarios",
        },
      },
      estados_idestados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          table: "estados",
          key: "idestados",
        },
      },
      fecha_creacion: {
        type: DataTypes.DATE,
      },
      nombre_completo: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING(250),
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
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_orden: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "Orden",
      timestamps: false,
    },
  )
  return Orden
}
