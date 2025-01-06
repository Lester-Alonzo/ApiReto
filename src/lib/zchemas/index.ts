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
  categoria: z.string(),
  nombre: z.string(),
  marca: z.string(),
  stock: z.string(),
  estado: z.string(),
  precion: z.string(),
})

// export const Orden = z.object({
//   pedido: z.object({
//     estado: z.number(),
//     nombreCom: z.string(),
//     direccion: z.string(),
//     telefono: z
//       .string()
//       .regex(/^\d{4}-\d{4}$/, "No es la estructura de un telefono"),
//     correo: z.string().email("No es un email"),
//     total: z.number(),
//     cliente: z.number(),
//   }),
//   articulos: z.array(
//     z.object({
//       pid: z.number(),
//       cantidad: z.number(),
//       precio: z.number(),
//       subtotal: z.number(),
//     }),
//   ),
// })

export const Clientes = z.object({
  razonsocial: z.string(),
  nombre: z.string(),
  direccion: z.string(),
  telefono: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "No es la estructura de un telefono"),
  email: z.string().email(),
  pass: z.string(),
})
