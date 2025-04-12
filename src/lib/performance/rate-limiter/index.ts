import { handleGetUserCached } from "@/lib/performance/cache";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit"
import { client } from "./redis";

const ratelimit = new Ratelimit({
    redis: client,
    limiter: Ratelimit.tokenBucket(5, "5 m", 5)
})

export const handleRateLimit = async (request: Request) => {
    const ip = request.headers.get("x-forwarded-for") ?? "";
    const { success } = await ratelimit.limit(ip)

    if (!success) {
        const user = await handleGetUserCached()
        return NextResponse.json({user, cached: true})
    } 
}