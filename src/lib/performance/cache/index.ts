import { handleGetSession } from "@/lib/auth/authActions";
import { handleGetUser } from "@/lib/auth/getUser";
import { client } from "@/lib/performance/cache/redis";
import { NextResponse } from "next/server";


export const handleGetUserCached = async (email: string | undefined) => {

    if (!email) return false;

    const cacheKey = `user:${email}`;
    const cached = await client.get(cacheKey);

    if (cached) {
        return cached
    } else {
        const session = await handleGetSession();

        if (!session?.user?.email) {
          return NextResponse.json({ error: "Missing session - not authenticated" }, { status: 400 });
        }
      
        const existingUser = await handleGetUser(session);
        if (!existingUser) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
      
      
        const cacheKey = `user:${email}`;
        await client.set(cacheKey, existingUser, { ex: 600 });
      
        return existingUser
    }
};