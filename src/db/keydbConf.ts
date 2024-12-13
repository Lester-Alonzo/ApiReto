import { Redis } from "ioredis"

export const keyDB = new Redis({
  host: "127.0.0.1",
  port: 6379,
})

//usage set: await redis.set(key, value)
//get: await redis.get(key)
