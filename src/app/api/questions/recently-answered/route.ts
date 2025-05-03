import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET recently answered questions
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required in query parameters' },
        { status: 400 }
      );
    }

    // Get session and authenticate - just check if session exists
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const userObjectId = new ObjectId(userId);

    // Find recently answered questions for this user
    const questions = await db.collection('userQuestions') // Assuming this collection exists
      .find({ 
        userId: userObjectId 
      })
      .sort({ answeredAt: -1 })
      .limit(limit)
      .toArray();
    
    // Map _id to string if necessary
    const processedQuestions = questions.map(q => ({
         ...q,
         _id: q._id.toHexString()
    }));

    return NextResponse.json({
      success: true,
      recentlyAnswered: processedQuestions
    });
    
  } catch (error) {
    console.error('Error fetching recently answered questions:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching recently answered questions' },
      { status: 500 }
    );
  }
}

// Endpoint to record a newly answered question
export async function POST(req: Request) {
  try {
    const { userId, questionId, question, isCorrect, section } = await req.json();

    // Validate input
    if (!userId || !questionId || !question) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock record insertion
    const now = new Date();
    
    // Create a mock question record
    const questionRecord = {
      _id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      questionId,
      question,
      isCorrect: !!isCorrect,
      section: section || 'general',
      answeredAt: now.toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Question response recorded',
      questionRecord
    });
    
  } catch (error) {
    console.error('Error recording answered question:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while recording the answered question' },
      { status: 500 }
    );
  }
} 