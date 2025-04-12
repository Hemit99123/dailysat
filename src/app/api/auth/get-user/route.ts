import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";
import handleRateLimitedRoutes from "@/lib/performance/rate-limiter";
import { NextRequest } from "next/server";

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

export const GET = async (req: NextRequest) => {

    const rateLimitResponse = await handleRateLimitedRoutes();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await auth();
    
    try {
        const user = await handleGetUser(session);
        return Response.json({
            user
        })
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
    }
}
