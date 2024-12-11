import { Redis } from "ioredis"

const keyDB = new Redis({
    host:"127.0.0.1",
    port: 6379
})

async function pingKeydb() {
    try {
    let result = await keyDB.ping()
    console.log(result)
    } catch(err ) {
        console.log(err)
    }
}

(async () => await pingKeydb())()

//usage set: await redis.set(key, value)
//get: await redis.get(key)