import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const redisSession = new Redis({
   url: process.env.REDIS_SESSION_URL,
   token: process.env.REDIS_SESSION_TOKEN
})