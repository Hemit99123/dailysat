import { auth } from '@/lib/auth';
import { QUESTION_IS_CORRECT_POINTS } from '@/data/constant';
import { client } from '@/lib/mongo';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/questions/handle-submit:
 *   post:
 *     summary: Process user answer and update database
 *     description: >
 *       Verifies a JWT token, extracts the user's answer state and attempt count, 
 *       and updates the user's data in the database accordingly.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jwtToken:
 *                 type: string
 *                 description: JWT token containing answer state and attempt count.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Successfully processed the answer and updated the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: DONE
 *                 isCorrect:
 *                   type: boolean
 *                   description: Indicates if the answer was correct.
 *                   example: true
 *       400:
 *         description: Bad request due to missing parameters or invalid email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 400
 *                 error:
 *                   type: string
 *                   description: Error message explaining the issue.
 *                   example: JWT token was not specified
 *       401:
 *         description: Unauthorized request due to invalid or expired JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating JWT verification failure.
 *                   example: JWT issue: invalid token
 *       500:
 *         description: Internal server error due to issues with JWT verification, database connection, or other errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 error:
 *                   type: string
 *                   description: Generic error message.
 *                   example: Internal server error
 *                 errorMsg:
 *                   type: string
 *                   description: Detailed error message for debugging.
 */


const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Use type assertion to ensure it's a JwtPayload so that typescript voids errors
  } catch (error) {
    throw new Error(`JWT issue: ${error}`);
  }
}

export const POST = async (request: Request) => {
  const { jwtToken } = await request.json();

  // Check if the JWT token is provided
  if (!jwtToken) {
    return Response.json({
      error: 'JWT token was not specified',
    }, { status: 400 });
  }

  try {
    // Verify JWT and extract the payload
    const decodedToken = verifyJWT(jwtToken);
    const { id, attempts, type, answer }= decodedToken;

    // Check if the required parameters are valid
    if (!id || attempts == null || !type) {
      throw new Error("All params in JWT not found")
    }

    const session = await auth();
    const email = session?.user?.email;

    await client.connect();

    const db = client.db('DailySAT');
    const usersColl = db.collection('users');

    const questionCollName = type === "math" ? "questions-math" : type === "reading-writing" ? "questions-reading" : null
    
    // default to reading/writing sat bank
    const questionsColl = db.collection(questionCollName || "questions-reading");
  
    // Retrieve the question from the database
    const question = await questionsColl.findOne({ _id: new ObjectId(id) });

    if (!question) {
      throw new Error("No questions found")
    }

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === answer;

    // Update the user's database with the new information
    await usersColl.updateOne(
      { email },
      {
        $inc: {
          currency: isCorrect && attempts === 0 ? QUESTION_IS_CORRECT_POINTS : 0,
          correctAnswered: isCorrect ? 1 : 0,
          wrongAnswered: !isCorrect ? 1 : 0,
        },
      }
    );

    client.close();

    // Return a success response
    return Response.json({
      result: 'DONE',
      isCorrect,
    });
  } catch (error) {
    return Response.json({
      code: 500,
      error: error,
    });
  }
}
