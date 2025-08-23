import { handleGetSession } from "@/lib/auth/authActions";
import { client } from "@/lib/mongo";
import { NextResponse } from "next/server";
import { handleRatelimitSuccess } from "@/lib/rate-limiter";

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
  try { 
    await client.connect();
    const session = await handleGetSession();
    
    // Check if session exists
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "No valid session found" }, 
        { status: 400 }
      );
    }

    const email = session.user.email;

    const rateLimitStatus = await handleRatelimitSuccess(email);

    if (rateLimitStatus === "reached") {
      return NextResponse.json(
        { error: "Rate limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const db = client.db("DailySAT");
    const usersCollection = db.collection("users");

    // Find the user
    let user = await usersCollection.findOne({ email: session.user.email });

    // If user doesn't exist, create a new record
    if (!user) {
      const newUser = {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        id: session.user.id,
        currency: 0,
        wrongAnswered: 0,
        correctAnswered: 0,
        isReferred: false,
        itemsBought: []
      };

      const result = await usersCollection.insertOne(newUser);
      // Retrieve the newly created user for returning
      user = await usersCollection.findOne({ _id: result.insertedId });
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    return NextResponse.json(
      { error }, 
      { status: 500 }
    );
  } finally {
    // Ensure the client connection is closed
    await client.close();
  }
};