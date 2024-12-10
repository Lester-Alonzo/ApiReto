import {z} from 'zod'

export const Credentials = z.object({
    email: z.string().email("El correo Electronico no es valido"),
    pass: z.string().min(8, "La contraseña debe tener por lo menos 8 caracteres").regex(/[a-z]/, "La contraseña debe contener por lo menos 1 letra minuscula").regex(/[A-Z]/, "La contraseña debe contener por lo menos 1 letra mayuscula").regex(/[0-9]/, "La contraseña debe contener por lo menos 1 numero").regex(/[\W_]/, "La contraseña debe contener por lo menos 1 simbolo")
})
