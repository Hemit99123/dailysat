import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import { client as cacheClient } from "@/lib/performance/cache/redis";
import { User } from "@/types/user";

/**
 * @swagger
 * /api/auth/update-user-data:
 *   get:
 *     summary: Fetch user data with JWT authentication and Redis caching
 *     description: 
 *       Verifies the JWT token provided in the `Authorization` header. If valid, retrieves user data from the database or Redis cache. Updates the cache if necessary and returns the user's information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Bearer token for user authentication.
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <JWT_TOKEN>
 *     responses:
 *       200:
 *         description: User data successfully retrieved and cache updated if necessary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: A message indicating success.
 *                   example: Success - using cache UPDATED
 *                 user:
 *                   type: object
 *                   description: The user's information.
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
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating missing or invalid token.
 *                   example: Missing token :(
 *       403:
 *         description: Forbidden - User is not authorized to access the resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating access is denied.
 *                   example: No access
 *       500:
 *         description: Internal server error - Issues with JWT verification, database, or cache operations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   description: Error details for debugging.
 */

export const GET = async (request: Request) => {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({
            error: "Missing token"
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
            await cacheClient.set(
                userEmail || "",
                JSON.stringify(userData),
                { keepTtl: true }
              );
        }

        // Assign the user data to cacheData

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
