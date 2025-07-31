"use server"

import { QUESTION_IS_CORRECT_POINTS } from '@/data/constant';
import { client } from '@/lib/mongo';
import { handleGetSession } from '@/lib/auth/authActions';

export const handleSubmitQuestion = async (isCorrect: boolean) => {
  try {
    await client.connect();

    const session = await handleGetSession();
    const email = session?.user?.email;

    if (!email) {
      throw new Error("User email not found in session.");
    }

    const db = client.db('DailySAT');
    const usersColl = db.collection('users');

    await usersColl.updateOne(
      { email },
      {
        $inc: {
          currency: isCorrect ? QUESTION_IS_CORRECT_POINTS : 0,
          correctAnswered: isCorrect ? 1 : 0,
          wrongAnswered: !isCorrect ? 1 : 0,
        },
      }
    );

    await client.close();

    return {
      status: 200,
      result: 'Server action done',
      isCorrect,
    };
  } catch (error: any) {
    return {
      status: 500,
      error: error.message || 'Internal Server Error',
    };
  }
};
