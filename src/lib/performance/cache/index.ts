import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client } from "@/lib/performance/cache/redis"; 
import { NextResponse } from "next/server";

export const handleGetUserCached = async () => {
    let cacheData = await client.get('1');
    const session = await auth()

    const existingUser = await handleGetUser(session)

    if (!cacheData) {
        try {

            if (!existingUser) {
                throw new Error("User not found");
            }

            const userData = {
                email: existingUser.email,
                name: existingUser.name,
                currency: existingUser.currency,
                image: existingUser.image,
                _id: existingUser._id,
                correctAnswered: existingUser.correctAnswered,
                wrongAnswered: existingUser.wrongAnswered,
                isReferred: existingUser.isReferred,
            };

            await client.set('1', JSON.stringify(userData));
            cacheData = await client.get('1'); // Re-fetch to ensure value

            return userData;
        } catch (error) {
            console.error("Error fetching user from API:", error);
            throw error; // Re-throw to handle at a higher level
        }
    }

    console.log("Existing cacheData:", cacheData);
    
    // Check if cacheData is already an object
    if (typeof cacheData === 'object' && cacheData !== null) {
        return NextResponse.json({user: cacheData, cached: true});
    }
};