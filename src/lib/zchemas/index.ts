import { z } from "zod"

export const Credentials = z.object({
  email: z.string().email("El correo Electronico no es valido"),
  pass: z
    .string()
    .min(8, "La contraseña debe tener por lo menos 8 caracteres")
    .regex(
      /[a-z]/,
      "La contraseña debe contener por lo menos 1 letra minuscula",
    )
    .regex(
      /[A-Z]/,
      "La contraseña debe contener por lo menos 1 letra mayuscula",
    )
    .regex(/[0-9]/, "La contraseña debe contener por lo menos 1 numero")
    .regex(/[\W_]/, "La contraseña debe contener por lo menos 1 simbolo"),
  rol: z.number({ message: "No es un id valido" }),
  estado: z.number({ message: "No es un id valido" }),
  telefono: z.string().regex(/^\d{4}-\d{4}$/),
  nombre: z.string({ message: "Tiene que ser un nombre completo" }),
})
export const LoginSche = z.object({
  email: z.string().email("No es un email valido"),
  pass: z.string(),
})

export const PassVal = z
  .string()
  .min(8, "La contraseña debe tener por lo menos 8 caracteres")
  .regex(/[a-z]/, "La contraseña debe contener por lo menos 1 letra minuscula")
  .regex(/[A-Z]/, "La contraseña debe contener por lo menos 1 letra mayuscula")
  .regex(/[0-9]/, "La contraseña debe contener por lo menos 1 numero")
  .regex(/[\W_]/, "La contraseña debe contener por lo menos 1 simbolo")

export const Producto = z.object({
  categoria: z.number(),
  nombre: z.string(),
  marca: z.string(),
  stock: z.number(),
  estado: z.number(),
  precion: z.number(),
})

export const Orden = z.object({
  pedido: z.object({
    estado:z.number(),
    nombreCom:z.string(),
    direccion:z.string(),
    telefono:z.string().regex(/^\d{4}-\d{4}$/, "No es la estructura de un telefono"),
    correo:z.string().email("No es un email"),
    total: z.number(),
    cliente:z.number()
  }),
  articulos: z.array(z.object({
    pid:z.number(),
    cantidad: z.number(),
    precio: z.number(),
    subtotal:z.number()
  }))
})