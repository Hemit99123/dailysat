import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client as cacheClient } from "@/lib/performance/cache/redis";
import { handleAPiHits, handleIncreaseAPIHits } from "@/lib/performance/rate-limiter/helper/apiHits";
import { User } from "@/types/user";

/**
 * @swagger
 * /api/auth/get-user:
 *   get:
 *     summary: Fetch user data with rate limiting and caching mechanisms
 *     description: 
 *       Retrieves user data by session email. Implements rate limiting based on API hit counts and utilizes Redis caching for improved performance.
 *     parameters:
 *       - name: session
 *         in: header
 *         description: The session object containing user authentication details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email address of the authenticated user.
 *     responses:
 *       200:
 *         description: User data successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: A message indicating success.
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: The user's email address.
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                     currency:
 *                       type: string
 *                       description: The user's preferred currency.
 *                     image:
 *                       type: string
 *                       description: URL of the user's profile image.
 *                     _id:
 *                       type: string
 *                       description: The user's unique database ID.
 *                     correctAnswered:
 *                       type: number
 *                       description: Count of correctly answered questions.
 *                     wrongAnswered:
 *                       type: number
 *                       description: Count of incorrectly answered questions.
 *                     isReferred:
 *                       type: boolean
 *                       description: Indicates whether the user was referred.
 *       429:
 *         description: Rate limit exceeded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message explaining that the rate limit has been reached.
 *       400:
 *         description: Missing or invalid session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 *       500:
 *         description: Internal server error, including issues with caching or database operations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A generic error message for internal server issues.
 */

export const GET = async () => {
    console.log("Getting backend user...")
    const session = await auth();

    const userEmail: string | null | undefined = session?.user?.email;

    try {
        console.log("checking redis")
        const numberHits: number = await handleAPiHits(userEmail || "");

        // Define the request limit
        const limit = 2; // Maximum allowed requests

        if (numberHits == limit) {
            // Try to fetch the user data from the cache
            let cacheData = await cacheClient.get(userEmail || "");

            // If no cached data exists, fetch it from the database and store it in the cache
            if (!cacheData) {
                const existingUser = await handleGetUser(session);

                // Prepare the user data to store in Redis
                const userData: User = {
                    email: existingUser?.email,
                    name: existingUser?.name,
                    currency: existingUser?.currency,
                    image: existingUser?.image,
                    _id: existingUser?._id as unknown as string ,
                    correctAnswered: existingUser?.correctAnswered,
                    wrongAnswered: existingUser?.wrongAnswered,
                    isReferred: existingUser?.isReferred
                };

                // Store the user data in Redis with a 300-second expiration time
                cacheClient.set(userEmail || "", JSON.stringify(userData), "EX", 300);

                // Assign the user data to cacheData
                cacheData = JSON.stringify(userData);
            }

            // Return the cached user data
            return new Response(
                JSON.stringify({
                    result: "Success - using cache",
                    user: JSON.parse(cacheData),
                }),
                { status: 200 }
            );
        } else {
            // Otherwise, increment the number of hits and continue (no need to increment if surpassed the limit)
            await handleIncreaseAPIHits(numberHits, userEmail || "");

             // Proceed with fetching the user data
            const user = await handleGetUser(session);
            return new Response(JSON.stringify({ result: "Success", user }), { status: 200 });
        }
    } catch (error) {
        console.error("Error with rate limiting or fetching user data:", error);
        return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
    }
}
