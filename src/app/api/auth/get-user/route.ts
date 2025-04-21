import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
// import { handleGetUserCached } from "@/lib/performance/cache";
// import { handleRatelimitSuccess } from "@/lib/performance/rate-limiter";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/get-user:
 *   get:
 *     summary: Fetch user data
 *     description: Retrieves user data by session email.
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
 *         description: Internal server error.
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
    const session = await auth();

    // Rate limiting and caching might need adjustments now we use DB
    // For now, we disable them to ensure we always get fresh DB data
    // const success = await handleRatelimitSuccess();
    // if (!success) { ... }

    try {
        // Use the handleGetUser function that interacts with the database
        const user = await handleGetUser(session);

        if (!user) {
            // Handle case where user couldn't be fetched or created
            return NextResponse.json({ message: "User not found or could not be created", user: null }, { status: 404 });
        }
        
        console.log(`[API get-user] Returning user data for ${user.email}:`, user._id);

        return NextResponse.json({
            user, // The user object from handleGetUser should now be correct
            cached: false // Data is fresh from DB (or created)
        })
    } catch (error) {
        console.error("Error fetching user data via handleGetUser:", error);
        return NextResponse.json({ message: "An error occurred fetching user data", user: null }, { status: 500 });
    }
}
