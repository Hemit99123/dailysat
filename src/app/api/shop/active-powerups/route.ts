import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ActivePowerup } from '@/types/store';
import { User } from '@/types/user';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // Get session and authenticate - just check if session exists
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) { // Only check if session exists
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
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
    const usersCollection = db.collection<User>("users");
    const userObjectId = new ObjectId(userId);
    const filter = { _id: userObjectId as any };

    // Find the user
    const user = await usersCollection.findOne(filter);

    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Filter for active powerups and calculate remaining time
    const now = Date.now();
    const activePowerups = (user.activePowerups || [])
        .filter(p => p.isActive && new Date(p.activeUntil).getTime() > now)
        .map(p => ({
            ...p,
            remainingTime: Math.max(0, (new Date(p.activeUntil).getTime() - now) / 1000) // Calculate remaining seconds
        }));

    console.log(`[API active-powerups] Returning active powerups for ${userId}:`, activePowerups);
    
    return NextResponse.json({
      success: true,
      activePowerups
    });
    
  } catch (error) {
    console.error('Error fetching active powerups:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching active powerups' },
      { status: 500 }
    );
  }
} 