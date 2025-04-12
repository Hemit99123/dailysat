export const runtime = "edge";

import { Ratelimit } from "@upstash/ratelimit"
import { client } from "./redis";
import { Session } from "next-auth";

const ratelimit = new Ratelimit({
    redis: client,
    limiter: Ratelimit.tokenBucket(5, "5 m", 5)
})

// passing in session so we don't have to call it again (should already be)
export const handleRateLimit = async (session: Session | null) => {
    const email = session?.user?.email

    const { success } = await ratelimit.limit(email as string)
    return success
}