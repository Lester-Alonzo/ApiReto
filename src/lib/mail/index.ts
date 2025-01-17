import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"
process.loadEnvFile()

const mailerSend = new MailerSend({
  apiKey: process.env.MAISKEY as string,
})

/**
 *
 * @param {string} to - Email del cliente
 * @param {string} nombre - Nombre del Cliente
 * @param {{asunto:string, body:string}} mail - cuerpo del email y el asunto
 * @example
 * ```ts
 *  SendEmail("prueba@prueba.com", "PruebaCliente", {asunto:"Mensaje de Prueba", body:"Este es un mensaje de preuba para esta app"})
 * ```
 */
export async function SendEmail(
  to: string,
  nombre: string,
  mail: { asunto: string; body: string },
) {
  const senTFrom = new Sender(
    "info@mitienditaonline.online",
    "Mi Tiendita Online",
  )
  const recipients = [new Recipient(to, nombre)]
  const emailParams = new EmailParams()
    .setFrom(senTFrom)
    .setTo(recipients)
    .setSubject(mail.asunto)
    .setHtml(mail.body)
  try {
    await mailerSend.email.send(emailParams)
  } catch (error) {
    console.log(error)
  }
}

//SendEmail("lestergeo96@gmail.com", "Lag", {asunto:"Prueba", body:"Mensaje de prueba"}).finally(() => console.log("Se envio el mensaje"))
