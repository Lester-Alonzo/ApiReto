import {createTransport} from 'nodemailer'
import type { MailOptions } from 'nodemailer/lib/json-transport';

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

export async function SendMail(mail:MailOptions) {
    await transporter.sendMail(mail)
}