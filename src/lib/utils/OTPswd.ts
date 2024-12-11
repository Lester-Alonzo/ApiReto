import * as crypto from "crypto"
import { IVTEXT, KEYTEXT } from "../constants"

export class PswUtils {
  #config_max_numbers: number
  #config_sed_ramdomText: string
  #keyText: Buffer
  #iv: Buffer
  #alg: string
  constructor(m_numbers: number, sed: string) {
    this.#config_max_numbers = m_numbers
    this.#config_sed_ramdomText = sed
    this.#keyText = Buffer.from(KEYTEXT, "hex")
    this.#iv = Buffer.from(IVTEXT, "hex")
    this.#alg = "aes-256-cbc"
  }
  async OTPNumber(): Promise<number[]> {
    return new Promise((resolve) => {
      let returnned: number[] = []
      for (let i = 0; i < this.#config_max_numbers; i++) {
        let Random = Math.floor(Math.random() * (10 - 0)) + 0
        returnned.push(Random)
      }
      resolve(returnned)
    })
  }
  #encrypt(text: string) {
    const cipher = crypto.createCipheriv(this.#alg, this.#keyText, this.#iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return encrypted
  }
  #decrypt(encryptedData: string) {
    const decipher = crypto.createDecipheriv(this.#alg, this.#keyText, this.#iv)
    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  }
  async UserHash(): Promise<string> {
    return new Promise((resolve, reject) => {})
  }
  prueba() {
    const enc = this.#encrypt("Hola a todos")
    console.log(enc)
    const dec = this.#decrypt(enc)
    console.log(dec)
  }
  async ValidateOPTN() {}
  async ValidateEmail() {}
}
const pureba = new PswUtils(4, "lag")

pureba.OTPNumber().then((j) => console.log(j))
pureba.prueba()
