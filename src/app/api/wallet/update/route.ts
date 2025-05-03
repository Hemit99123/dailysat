import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { userId, walletAddress } = await req.json();

    // Validate user ID
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Update user with wallet address
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { phantomWallet: walletAddress } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Wallet address updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating wallet address:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating wallet address' },
      { status: 500 }
    );
  }
} 