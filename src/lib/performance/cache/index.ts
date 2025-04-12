import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client } from "@/lib/performance/cache/redis";
import { NextResponse } from "next/server";


export const handleGetUserCached = async () => {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return false;

    const cacheKey = `user:${email}`;
    const cached = await client.get(cacheKey);

    if (cached) {
        return cached
        
    } else {
        const session = await auth();
        if (!session?.user?.email) {
          return NextResponse.json({ error: "Missing session" }, { status: 400 });
        }
      
        const existingUser = await handleGetUser(session);
        if (!existingUser) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
      
        const { email, name, currency, image, _id, correctAnswered, wrongAnswered, isReferred } = existingUser;
        const user = { email, name, currency, image, _id, correctAnswered, wrongAnswered, isReferred };
      
        const cacheKey = `user:${email}`;
        await client.set(cacheKey, user, { ex: 600 });
      
        return user
    }
};