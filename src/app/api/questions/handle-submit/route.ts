import { auth } from '@/lib/auth';
import { QUESTION_IS_CORRECT_POINTS } from '@/data/constant';
import { client } from '@/lib/mongo';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { User } from '@/types/user';
import { ActivePowerup } from '@/types/store';

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
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    throw new Error(`JWT issue: ${error}`);
  }
}

export const POST = async (request: Request) => {
  const { jwtToken } = await request.json();

  if (!jwtToken) {
    return Response.json({ error: 'JWT token was not specified' }, { status: 400 });
  }

  let dbClient;

  try {
    // Verify JWT and extract the payload
    const decodedToken = verifyJWT(jwtToken);
    const { id: questionIdString, attempts, type, answer } = decodedToken;

    // Validate JWT payload
    if (!questionIdString || attempts == null || !type) {
      throw new Error("Required parameters (id, attempts, type) not found in JWT payload");
    }

    // Authenticate user
    const session = await auth();
    const userEmail = session?.user?.email;
    const userId = session?.user?.id;

    if (!userEmail || !userId) {
       throw new Error("User not authenticated or user ID missing from session");
    }

    // Connect to DB
    dbClient = await client.connect();
    const db = dbClient.db('DailySAT');
    const usersColl = db.collection<User>('users');
    const userQuestionsColl = db.collection('userQuestions');
    const questionCollName = type === "math" ? "questions-math" : type === "reading-writing" ? "questions-reading" : null;

    if (!questionCollName) {
        throw new Error("Invalid question type specified in JWT");
    }
    const questionsColl = db.collection(questionCollName);

    // Fetch Question and User data concurrently
    const questionObjectId = new ObjectId(questionIdString);
    
    // Look up user by email instead of ID since user IDs might be in different formats
    // between Auth system and MongoDB

    const [question, currentUser] = await Promise.all([
        questionsColl.findOne({ _id: questionObjectId }),
        usersColl.findOne({ email: userEmail })
    ]);

    if (!question) {
      throw new Error(`Question not found with ID: ${questionIdString}`);
    }
    if (!currentUser) {
        throw new Error(`User not found with email: ${userEmail}`);
    }

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === answer;
    const now = new Date();

    // --- Check if this is the first attempt for this question ---
    const previousAttempt = await userQuestionsColl.findOne({
        userId: currentUser._id, // Use the MongoDB _id
        questionId: questionObjectId
    });
    const isFirstAttempt = !previousAttempt;

    // Check if the user has previously gotten this question correct
    const previousCorrectAttempt = await userQuestionsColl.findOne({
        userId: currentUser._id,
        questionId: questionObjectId,
        isCorrect: true
    });
    const hasAlreadyGottenCorrect = !!previousCorrectAttempt;

    let pointsEarned = 0;
    let incrementCorrect = 0;
    let incrementWrong = 0;
    let streakUpdate = {};

    // --- Logic for first attempt ---
    if (isFirstAttempt) {
        if (isCorrect) {
            // 1. Calculate points with multiplier
            const activePowerups: ActivePowerup[] = currentUser.activePowerups?.filter(p =>
                p.isActive &&
                (p.itemType === 'multiplier' || p.type === 'multiplier') &&
                new Date(p.activeUntil) > now
            ) || [];

            let highestMultiplier = 1;
            if (activePowerups.length > 0) {
                highestMultiplier = activePowerups.reduce((max, p) => Math.max(max, p.itemValue || p.value || 1), 1);
            }
            pointsEarned = QUESTION_IS_CORRECT_POINTS * highestMultiplier;

            // 2. Mark for stat update
            incrementCorrect = 1;

            // 3. Update streak (simple example: increment current, check against longest)
            const newStreak = (currentUser.currentStreak || 0) + 1;
            streakUpdate = {
                $set: {
                    currentStreak: newStreak,
                    longestStreak: Math.max(currentUser.longestStreak || 0, newStreak)
                }
            };

        } else {
            // Incorrect on first attempt
            incrementWrong = 1;
            // Reset streak
            streakUpdate = { $set: { currentStreak: 0 } };
        }
    } else {
        // --- Logic for subsequent attempts ---
        if (isCorrect && !hasAlreadyGottenCorrect) {
            // They got it right this time, but it wasn't their first attempt
            // Award points for correct answer regardless of attempt number
            const activePowerups: ActivePowerup[] = currentUser.activePowerups?.filter(p =>
                p.isActive &&
                (p.itemType === 'multiplier' || p.type === 'multiplier') &&
                new Date(p.activeUntil) > now
            ) || [];

            let highestMultiplier = 1;
            if (activePowerups.length > 0) {
                highestMultiplier = activePowerups.reduce((max, p) => Math.max(max, p.itemValue || p.value || 1), 1);
            }
            pointsEarned = QUESTION_IS_CORRECT_POINTS * highestMultiplier;
            
            incrementCorrect = 1;
        } else if (!isCorrect && !hasAlreadyGottenCorrect) {
            // They're still getting it wrong and haven't gotten it right before
            // We don't want to count multiple wrong attempts, so don't increment wrong count again
            incrementWrong = 0;
        }
    }

    // --- Update User Document ---
    const updateOps: { $inc: Record<string, number>; $set?: Record<string, number> } = { $inc: {} };
    if (pointsEarned > 0) updateOps.$inc.currency = pointsEarned;
    if (incrementCorrect > 0) updateOps.$inc.correctAnswered = incrementCorrect;
    if (incrementWrong > 0) updateOps.$inc.wrongAnswered = incrementWrong;
    if (Object.keys(streakUpdate).length > 0) {
        // Merge streak update ($set) with other operations
        Object.assign(updateOps, streakUpdate);
    }

    if (Object.keys(updateOps.$inc).length > 0 || Object.keys(streakUpdate).length > 0) {
        await usersColl.updateOne({ _id: currentUser._id }, updateOps);
    }

    // --- Record the Answer Attempt ---
    // Save regardless of attempt number or correctness for history
    await userQuestionsColl.insertOne({
        userId: currentUser._id,
        questionId: questionObjectId,
        questionText: question.question,
        section: type,
        isCorrect: isCorrect,
        answeredAt: now,
        attemptNumber: previousAttempt ? (previousAttempt.attemptNumber || 1) + 1 : 1
    });

    // Return a success response
    return Response.json({
      result: 'DONE',
      isCorrect,
      pointsEarned,
    });

  } catch (error: unknown) {
    // Close the MongoDB connection if it was opened
    if (dbClient) {
      await dbClient.close();
    }

    console.error("Error in POST /api/questions/handle-submit:", error);

    // Safely extract error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error processing submission';

    return Response.json({ 
      code: 500, 
      error: "Internal server error", 
      errorMsg: errorMessage 
    }, { status: 500 });
  }
}
