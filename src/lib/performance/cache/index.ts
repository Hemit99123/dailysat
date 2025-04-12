import axios from "axios";
import { client } from "@/lib/performance/cache/redis"; 

export const handleGetUserCached = async () => {
   const cacheData = await client.get('1')

    if (!cacheData) {
        try {
            const response = await axios.get('http://localhost:3000/api/auth/get-user');

            const existingUser = response.data.user;

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
            await client.set('1', JSON.stringify(userData), { ex: 300 });

            return userData;
        } catch (error) {
            console.error("Error fetching user from API:", error);
        }
    }

    return JSON.parse(cacheData as string);
};


