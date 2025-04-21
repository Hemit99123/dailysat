import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Sponsor wallet address that pays for all transaction fees
const SPONSOR_WALLET_ADDRESS = 'DxCLCeV2YL7M8gDH1aDH7zkvjzvvthWNMRufPa9Rrkpg';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, itemId, transactionId, walletAddress } = data;

    if (!userId || !itemId || !transactionId || !walletAddress) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Verify this is a valid store item
    const storeItem = await db.collection('storeItems').findOne({ id: parseInt(itemId) });
    if (!storeItem) {
      return NextResponse.json({ success: false, message: 'Store item not found' }, { status: 404 });
    }

    // Check if this is an educational transaction (from our new flow)
    const isEducationalTransaction = transactionId.startsWith('edu-');

    // Verify user has enough tokens (if using the educational flow)
    if (isEducationalTransaction) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      if (user.tokens < storeItem.price) {
        return NextResponse.json({ 
          success: false, 
          message: 'Not enough tokens for this purchase'
        }, { status: 400 });
      }
    }

    // Record the transaction for audit purposes
    const transaction = {
      userId: new ObjectId(userId),
      itemId: parseInt(itemId),
      transactionId,
      walletAddress,
      amount: storeItem.price,
      timestamp: new Date(),
      isEducational: isEducationalTransaction,
      sponsorWallet: SPONSOR_WALLET_ADDRESS,
    };
    
    await db.collection('transactions').insertOne(transaction);

    // Apply the powerup
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + storeItem.duration);
    
    const activePowerup = {
      userId: new ObjectId(userId),
      itemId: parseInt(itemId),
      name: storeItem.name,
      multiplier: storeItem.multiplier,
      expiresAt,
      createdAt: new Date(),
      transactionId
    };
    
    await db.collection('activePowerups').insertOne(activePowerup);

    // Deduct the tokens from user balance if using educational flow
    if (isEducationalTransaction) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { tokens: -storeItem.price } }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Token purchase successful',
      powerup: activePowerup
    });
  } catch (error) {
    console.error('Purchase token error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Purchase failed' },
      { status: 500 }
    );
  }
} 