import { auth } from '@/auth';
import { QUESTION_IS_CORRECT_POINTS } from '@/data/CONSTANTS';
import { client } from '@/lib/mongo';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Verify JWT function
function verifyJWT(token: string): JwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Use type assertion to ensure it's a JwtPayload so that typescript voids errors
  } catch (error) {
    throw new Error(`JWT issue: ${error}`);
  }
}

export async function POST(request: Request) {
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

    // Update the user's database with the new information
    await coll.updateOne(
      { email },
      {
        $inc: {
          currency: state === 1 ? QUESTION_IS_CORRECT_POINTS && attempts == 0 : 0,
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
      error: 'Internal server error',
      errorMsg: error,
    });
  }
}
