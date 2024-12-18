import bcrypt from "bcrypt"

/**
 *
 * @param {string} pass - Password en Texto plano
 * @param {number} saltRounds - El numero de salt para hashear las password
 * @returns {Promise<string | null>}
 */
export async function HassPass(
  pass: string,
  saltRounds: number,
): Promise<string | null> {
  try {
    const hash = await bcrypt.hash(pass, saltRounds)
    console.log(hash)
    return hash
  } catch (error) {
    console.error(error)
    return null
  }
}
/**
 *
 * @param {string} pass - password en texto plano
 * @param {string} hash - hash a comparar
 */
export async function ComparePassword(pass: string, hash: string) {
  try {
    const match = await bcrypt.compare(pass, hash)
    console.log(match, pass, hash)
    return match
  } catch (error) {
    console.error(error)
    return false
  }
}
