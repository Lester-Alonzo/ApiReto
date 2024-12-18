import { DataTypes, type Sequelize, Model } from "@sequelize/core"
import {RolModel} from './rol'
import {EstadosModel} from './estados'

interface usuariosAtt {
  idusuarios?: number
  correo_electronico: string
  nombre_completo:string,
  password:string
  telefono:string
  fecha_nacimiento: Date,
  fecha_creacion?: Date
  rol_idrol:number
  estados_idestados:number
  Clientes_idClientes?:number
}
interface usuariosInstance extends Model<usuariosAtt, usuariosAtt>, usuariosAtt {}

export function usuariosModel(sequelize: Sequelize) {
  const usuarios = sequelize.define<usuariosInstance>(
    "usuarios",
    {
      idusuarios:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
        correo_electronico: {
            type:DataTypes.STRING(100),
            allowNull:false,
            unique:true
        },
        nombre_completo:{
            type: DataTypes.STRING(200),
            allowNull: false
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull:false
        },
        telefono:{
            type: DataTypes.STRING(45),
            allowNull:true
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
            allowNull:true
        },
        rol_idrol:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
                table:"rol",
                key:"idrol"
            }
        },
        estados_idestados:{
          type:DataTypes.INTEGER,
          references:{
            table:"estados",
            key:"idestados"
          }
        },
        Clientes_idClientes:{
          type:DataTypes.INTEGER,
          allowNull:true,
          references:{
            table:"clientes",
            key:"idClientes"
          }
        }
    },
    {
      tableName: "usuarios",
      timestamps: false,
    },
  )
  //usuarios.belongsTo(RolModel(sequelize), {foreignKey:"rol_idrol", as:'rol'})
  return usuarios
}