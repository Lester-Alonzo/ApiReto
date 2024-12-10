import bcrypt from 'bcrypt'

export async function HassPass(pass:string, saltRounds:number) {
    try {
        const hash = await bcrypt.hash(pass, saltRounds)
        console.log(hash)
        return hash
    } catch (error) {
        console.error(error)
    }
}

export async function ComparePassword(pass:string, hash:string) {
    try {
        const match = await bcrypt.compare(pass, hash)
        if(match) {
            console.log("es correcto")
        }else {
            console.log("es incorrecta")
        }
    } catch (error) {
        console.error(error)
    }
}
