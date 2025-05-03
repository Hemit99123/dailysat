import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// This endpoint is called whenever a user answers a question correctly
// It checks for active powerups and applies their effects

export async function POST(req: Request) {
  try {
    const { userId, baseCoins } = await req.json();

    if (!userId || baseCoins === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Start with base coins
    let boostedCoins = baseCoins;
    let highestMultiplier = 1; // Default multiplier is 1 (no boost)
    const appliedBoosts = [];
    const updatedPowerups = [];
    
    // Check for active powerups
    if (user.activePowerups && user.activePowerups.length > 0) {
      const now = new Date();
      
      // First, find the highest multiplier among active powerups
      for (const powerup of user.activePowerups) {
        const expirationTime = new Date(powerup.activeUntil);
        
        // Check if powerup is still active
        if (expirationTime > now) {
          // If it's a multiplier and it's higher than our current highest, update it
          if (powerup.type === 'multiplier' && powerup.value > highestMultiplier) {
            highestMultiplier = powerup.value;
          }
          
          // Update remaining time
          const remainingMs = expirationTime.getTime() - now.getTime();
          const remainingSeconds = Math.floor(remainingMs / 1000);
          
          updatedPowerups.push({
            ...powerup,
            remainingTime: remainingSeconds
          });
        }
      }
      
      // Apply the highest multiplier to the base coins
      if (highestMultiplier > 1) {
        boostedCoins = Math.floor(baseCoins * highestMultiplier);
        
        appliedBoosts.push({
          originalValue: baseCoins,
          boostedValue: boostedCoins,
          multiplier: highestMultiplier
        });
      }
      
      // Update user's active powerups if any expired
      if (updatedPowerups.length !== user.activePowerups.length) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { activePowerups: updatedPowerups } }
        );
      }
    }
    
    // Update user's currency with the boosted coins
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { currency: boostedCoins } }
    );
    
    return NextResponse.json({
      success: true,
      baseCoins,
      boostedCoins,
      multiplier: highestMultiplier,
      appliedBoosts,
      activePowerups: updatedPowerups
    });
    
  } catch (error) {
    console.error('Error applying powerup boost:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while applying powerup boost' },
      { status: 500 }
    );
  }
} 