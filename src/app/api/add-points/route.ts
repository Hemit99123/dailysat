import { auth } from "@/auth";
import { QUESTION_IS_CORRECT_POINTS } from "@/lib/CONSTANTS";
import { client } from "@/lib/mongo";
import { Collection, Db, Document } from "mongodb";

/**
 * @swagger
 * /api/add-points:
 *   post:
 *     summary: Add points for answering a question
 *     description: Adds points to a user's account based on whether their answer to a question is correct.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               question:
 *                 type: object
 *                 description: Question object
 *               state:
 *                 type: integer
 *                 description: State indicating if the answer is correct (1) or not (0)
 *               userAnswer:
 *                 type: string
 *                 description: User's answer to the question
 *     responses:
 *       200:
 *         description: Points added successfully
 *       400:
 *         description: A parameter was not specified
 *       500:
 *         description: Internal server error
 */

export async function POST(request: Request) {
  const { question, state, userAnswer} = await request.json();

  const session = await auth()

  const email = session?.user?.email
  
  // Check if the id query parameter is provided
  if (email === "" || question === null || state === "" || userAnswer === "") {
    return Response.json({
      code: 400,
      error: "a paramater was not specified", // Adjusted to 400 since it's a client-side error
    });
  } else {
    try {
      await client.connect();
      const db: Db = client.db("DailySAT");
      const coll: Collection<Document> = db.collection("users");
      
      // Insert the new bug ID into the database
      await coll.updateOne({"email" : email},{ $inc : {currency : state === 1 ? QUESTION_IS_CORRECT_POINTS : 0}, $addToSet : {questionsAnswered : {...question, correct : state, toc : Date.now(), userAnswer : userAnswer}} });
      client.close();

      // Return a success response with the inserted result
      return Response.json({
        result: "DONE",
      });
    } catch (error) {
      // Handle any database errors
      return Response.json({
        code: 500,
        error: "Internal server error",
        errorMsg: error
      });
    }
  }
}
