import { client } from "@/lib/mongo";

/**
 * @swagger
 * /api/user/points:
 *   get:
 *     summary: Retrieve user points
 *     description: Fetches the current points (currency) of a user based on their email.
 *     parameters:
 *       - name: email
 *         in: query
 *         description: The email of the user whose points need to be retrieved.
 *         required: true
 *         schema:
 *           type: string
 *           example: user@example.com
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's points.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 points:
 *                   type: integer
 *                   description: The user's current points (currency).
 *                   example: 150
 *       400:
 *         description: Missing or invalid email parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message indicating a missing email parameter.
 *                   example: bad request. make sure to specify the email parameter
 *       500:
 *         description: Database error while fetching user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: A generic error message for database failure.
 *                   example: database error
 */

export const GET = async (request: Request) => {
    const url: URL = new URL(request.url);
    const searchParams: URLSearchParams = new URLSearchParams(url.search);
    const userEmail: string = searchParams.get("email") || "";

    if (userEmail === "") {
        return Response.json({
            code: 400,
            message: "bad request. make sure to specify the email parameter"
        })
    }
    else {
        try {
            await client.connect();
            const db = client.db("DailySAT");

            const result = db.collection("users").find({ email: userEmail });
            const allValues = await result.toArray();

            return Response.json({
                code: 200,
                currency: allValues[0].currency
            })
        }
        catch {
            return Response.json({
                code: 500,
                message: "database error"
            });
        }
    }
}