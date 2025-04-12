export const runtime = "edge";

import { Ratelimit } from "@upstash/ratelimit"
import { client } from "./redis";

const ratelimit = new Ratelimit({
    redis: client,
    limiter: Ratelimit.tokenBucket(5, "5 m", 5)
})

export const handleRateLimit = async (request: Request) => {
    "use server"

    const ip = request.headers.get("x-forwarded-for") ?? "";
    const { success } = await ratelimit.limit(ip)

    return success
}