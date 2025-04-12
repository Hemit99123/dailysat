import { auth } from "@/lib/auth";
import axios from "axios";
import { client } from "@/lib/performance/cache/redis"; 

export const handleGetUserCached = async () => {
    const session = await auth();
    const email = session?.user?.email || "";

    if (!email) {
        throw new Error("Session or email not found");
    }

   const cacheData = await client.get(email)

    if (!cacheData) {
        try {
            const res = await axios.get('/api/auth/get-user');

            const existingUser = res.data.user;

            if (!existingUser) {
                throw new Error("User not found");
            }

            const userData = {
                email: existingUser.email,
                name: existingUser.name,
                currency: existingUser.currency,
                image: existingUser.image,
                _id: existingUser._id as unknown as string,
                correctAnswered: existingUser.correctAnswered,
                wrongAnswered: existingUser.wrongAnswered,
                isReferred: existingUser.isReferred,
            };

            // Upstash `.set()` usage (key, value, { ex: seconds })
            await client.set(email, JSON.stringify(userData), { ex: 300 });

            return userData;
        } catch (error) {
            console.error("Error fetching user from API:", error);
            throw new Error("Failed to fetch user");
        }
    }

    return JSON.parse(cacheData as string);
};


