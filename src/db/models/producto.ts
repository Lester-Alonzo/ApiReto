import { DataTypes, type Sequelize, Model } from "@sequelize/core"

interface ProductosAtt {
    idProductos?:number
    CategoriaProductos_IDCategoria:number
    usuarios_idusuarios:number
    estados_idestados:number
    nombre:string
    marca:string
    codigo:string
    stock:number
    fecha_creacion?:Date
    foto:BinaryType
}
interface ProductosInstance extends Model<ProductosAtt, ProductosAtt>, ProductosAtt {}

export function ProductoModel(sequelize: Sequelize) {
  const Productos = sequelize.define<ProductosInstance>(
    "Productos",
    {
        idProductos:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        CategoriaProductos_IDCategoria:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                table:"CategoriaProductos",
                key:"idCategoriaProductos"
            }
        },
        usuarios_idusuarios:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                table:"usuarios",
                key:"idusuarios"
            }
        },
        estados_idestados:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                table:"estados",
                key:"idestados"
            }
        },
        nombre:{
            type:DataTypes.STRING(45),
            allowNull:false
        },
        marca:{
            type:DataTypes.STRING(45),
            allowNull:false
        },
        codigo:{
            type:DataTypes.STRING(45),
            unique:true,
            allowNull:false
        },
        stock:{
            type:DataTypes.FLOAT,
            defaultValue: 0,
            allowNull:false
        },
        foto:{
            type:DataTypes.BLOB //TODO: Buscar el tipo correcto o cambiar si conecto claudinary
        }
    },
    {
      tableName: "Productos",
      timestamps: false,
    },
  )
  return Productos
}