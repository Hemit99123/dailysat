import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { UserStats } from '@/types/user';
import { auth } from '@/lib/auth'; // Use auth for session
import { User } from '@/types/user';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // Authenticate the request - just check if session exists
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    // Validate the userId from query param exists
    if (!userId) {
        return NextResponse.json(
          { success: false, message: 'User ID is required in query parameters' },
          { status: 400 }
        );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const userObjectId = new ObjectId(userId);
    
    // Get user data from DB
    const usersCollection = db.collection<User>("users"); 
    // Use 'as any' to bypass strict _id type check in filter
    const filter = { _id: userObjectId as any }; 
    const user = await usersCollection.findOne(filter);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Construct stats ONLY from the database user object
    const stats: UserStats = {
      currentStreak: user.currentStreak || 0, // Assuming these fields exist on the DB User doc
      longestStreak: user.longestStreak || 0,
      totalCorrect: user.correctAnswered || 0,
      totalIncorrect: user.wrongAnswered || 0,
      lastAnswered: user.lastAnswered || undefined,
      averageScore: user.averageScore || 0,
    };
    
    // If streak/avg score need calculation based on `userQuestions` collection:
    // const questions = await db.collection('userQuestions').find({ userId: userObjectId }).sort({ answeredAt: -1 }).toArray();
    // ... calculate currentStreak, averageScore from questions ...
    // ... update user document with longestStreak if currentStreak is greater ...
    
    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching user stats' },
      { status: 500 }
    );
  }
} 