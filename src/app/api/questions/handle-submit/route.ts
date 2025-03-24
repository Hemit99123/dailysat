import { auth } from '@/lib/auth';
import { QUESTION_IS_CORRECT_POINTS } from '@/data/constant';
import { client } from '@/lib/mongo';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * @swagger
 * /api/questions/handle-submit:
 *   post:
 *     summary: Process user answer and update database
 *     description: 
 *       Verifies a JWT token, extracts the user's answer state and attempt count, and updates the user's data in the database accordingly.
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
    }, {status: 400});
  }

  try {
    // Verify JWT and extract the payload
    const decodedToken = verifyJWT(jwtToken);

    // Ensure the payload contains the required fields
    const { state, attempts } = decodedToken;

    // Check if the required parameters are valid
    if (state === null || attempts == null) {
      return Response.json({
        code: 400,
        error: 'a parameter was not specified',
      });
    }

    const session = await auth();
    const email = session?.user?.email;

    // Ensure email is valid
    if (email === '') {
      return Response.json({
        code: 400,
        error: 'Email not found',
      });
    }

    await client.connect();
    const db = client.db('DailySAT');
    const coll = db.collection('users');

    console.log(attempts)

    // Update the user's database with the new information
    await coll.updateOne(
      { email },
      {
        $inc: {
          currency: attempts === 0 && state === 1  ? QUESTION_IS_CORRECT_POINTS : 0,
          correctAnswered: state === 1 ? 1 : 0,
          wrongAnswered: state !== 1 ? 1 : 0,
        },
      }
    );
    

    client.close();

    // Return a success response
    return Response.json({
      result: 'DONE',
    });
  } catch (error) {
    return Response.json({
      code: 500,
      error,
    });
  }
}
