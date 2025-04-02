import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client as cacheClient } from "@/lib/performance/cache/redis";


export const getUserDataWithCache = async (userEmail: string) => {
    const session = await auth();

    let cacheData = await cacheClient.get(userEmail || "");

    if (!cacheData) {
        const existingUser = await handleGetUser(session);

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

        await cacheClient.set(userEmail || "", JSON.stringify(userData), "EX", 300);
        return userData;
    }

    return JSON.parse(cacheData);
};
