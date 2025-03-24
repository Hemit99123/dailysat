import { client } from "../../../lib/mongo";
import { Db, Document, WithId } from "mongodb";
import { FIRST_250_BONUS } from "@/data/constants";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /initial-250-auth:
 *   post:
 *     summary: Update user currency with initial 250 bonus
 *     description: Updates the currency of a user by adding the initial 250 bonus if the user exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to update.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Successfully updated the user's currency.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "updated"
 *       400:
 *         description: Invalid email or error in reading request JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "invalid email" or "error in reading request JSON : give data in proper format"
 *       500:
 *         description: Error in connecting with the MongoDB client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "error in connecting with the mongodb client"
 */

export async function POST() {
    try {
        const session = await auth()
        const email = session?.user?.email

        try {
            await client.connect();

            const db: Db = client.db("DailySAT");

            // check if the referee exists
            const doc_check: WithId<Document> | null = await db.collection("users").findOne({ email: email });

            if (doc_check == null) {
                return Response.json({
                    code: 400,
                    result: 0,
                    message: "invalid email"
                })
            }
            else {
                await db.collection("users").findOneAndUpdate({ email : email}, { $inc: { currency: FIRST_250_BONUS } });

                return Response.json({
                    code: 200,
                    message: "updated"
                })
            }
        }

        catch {
            return Response.json({
                code: 500,
                message: "error in connecting with the mongodb client"
            })
        }
    }
    catch {
        return Response.json({
            code: 400,
            message: "error in reading request JSON : give  data in proper format"
        })
    }
}
