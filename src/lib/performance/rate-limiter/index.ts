export const runtime = "edge";

import { Ratelimit } from "@upstash/ratelimit"
import { client } from "./redis";

const ratelimit = new Ratelimit({
    redis: client,
    limiter: Ratelimit.tokenBucket(5, "5 m", 5)
})

export const handleRatelimitSuccess = async (email: string) => {

    const { success } = await ratelimit.limit(email as string)
    return success
}