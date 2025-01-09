import jwt from "jsonwebtoken";
import { auth } from "@/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client as cacheClient } from "@/lib/performance/cache/redis";
import { User } from "@/types/user";

export async function GET(request: Request) {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({
            error: "Missing token :("
        })
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    try {
        // Decode and verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { authorized: boolean };

        // Check if the token contains the required payload
        if (!decoded.authorized) {
            return Response.json({
                error: "No access"
            })
        }

        // Proceed with the rest of the logic
        const session = await auth();

        const userEmail: string | null | undefined = session?.user?.email;
        const existingUser = await handleGetUser(session);

        // Prepare the user data to store in Redis
        const userData: User = {
            email: existingUser?.email,
            name: existingUser?.name,
            currency: existingUser?.currency,
            image: existingUser?.image,
            _id: existingUser?._id as unknown as string,
            correctAnswered: existingUser?.correctAnswered,
            wrongAnswered: existingUser?.wrongAnswered,
            isReferred: true
        };

        const cache = await cacheClient.get(userEmail || "")

        // Only update the cache if needed (already stored information within cache)
        if (cache) {
            cacheClient.set(userEmail || "", JSON.stringify(userData), "KEEPTTL");
        }

        // Assign the user data to cacheData
        // Return the data

        return Response.json({
            result: "Success - using cache UPDATED",
            user: existingUser,
        })
    } catch (error) {
        return Response.json({
            error
        })
    }
}
