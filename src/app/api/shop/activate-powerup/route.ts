import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ActivePowerup } from '@/types/store';
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    const { userId, powerupId, count } = await req.json();
    const activationCount = count || 1;

    // Validate input
    if (!userId || !powerupId || activationCount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Get session and authenticate
    const session = await auth();
    const sessionUserId = session?.user?.id;
    
    // IMPORTANT: Just verify that the user is logged in (session exists)
    if (!sessionUserId) { 
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate the userId from the body exists (as an extra check)
    if (!userId) {
        return NextResponse.json(
          { success: false, message: 'User ID missing from request body' },
          { status: 400 }
        );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>("users");
    const userObjectId = new ObjectId(userId);
    const userFilter: import("mongodb").Filter<User> = { _id: userObjectId as any };

    // --- Perform Database Read & Validation --- 
    console.log(`[Activate Powerup] Attempting activation for User: ${userId}, Powerup: ${powerupId}, Count: ${activationCount}`);
    const user = await usersCollection.findOne(userFilter);

    if (!user) {
        console.error(`[Activate Powerup] User not found: ${userId}`);
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    const userPowerups = user.activePowerups || [];
    console.log(`[Activate Powerup] User ${userId} current powerups:`, JSON.stringify(userPowerups, null, 2));
    const inventoryIndex = userPowerups.findIndex(p => p.id === powerupId && !p.isActive);
    
    if (inventoryIndex === -1) {
      console.error(`[Activate Powerup] Powerup ${powerupId} not found in inventory for user ${userId}`);
      return NextResponse.json(
        { success: false, message: 'Powerup not found in inventory' },
        { status: 404 }
      );
    }
    
    const inventoryPowerup = userPowerups[inventoryIndex];
    const availableCount = inventoryPowerup.count || 1;
    console.log(`[Activate Powerup] Inventory details: ID=${inventoryPowerup.id}, Available=${availableCount}, Index=${inventoryIndex}`);
    
    if (activationCount > availableCount) {
       console.error(`[Activate Powerup] Insufficient count for ${powerupId}. Need: ${activationCount}, Have: ${availableCount}`);
      return NextResponse.json(
        { success: false, message: `Cannot activate ${activationCount} powerups, only ${availableCount} available` },
        { status: 400 }
      );
    }
    
    // --- Perform Database Updates --- 
    const durationPerUnit = inventoryPowerup.duration || 30; // minutes
    const addedDurationMs = durationPerUnit * activationCount * 60 * 1000; // milliseconds
    
    // --- Step 1: Update Inventory --- 
    let inventoryUpdateOperation: any = {};
    if (availableCount - activationCount <= 0) {
      // Remove the item from inventory using $pull
      inventoryUpdateOperation = { $pull: { activePowerups: { id: powerupId, isActive: false } } };
      console.log(`[Activate Powerup] Step 1: Pulling inventory item ${powerupId}`);
    } else {
      // Decrement count of the inventory item using $set
      const newCount = availableCount - activationCount;
      inventoryUpdateOperation = { $set: { [`activePowerups.${inventoryIndex}.count`]: newCount } };
       console.log(`[Activate Powerup] Step 1: Decrementing inventory item ${powerupId} to count ${newCount}`);
    }
    
    // Execute the inventory update
    const inventoryUpdateResult = await usersCollection.updateOne(userFilter, inventoryUpdateOperation);
    console.log(`[Activate Powerup] Step 1 Result:`, inventoryUpdateResult);

    // Check if the inventory update was successful before proceeding
    if (inventoryUpdateResult.modifiedCount === 0 && inventoryUpdateResult.matchedCount === 0) {
        // It's possible $pull matched but didn't modify if item wasn't there, but findIndex should prevent this.
        // Still, good to be cautious.
         console.error(`[Activate Powerup] Failed Step 1: Inventory update for ${powerupId}`);
        throw new Error("Failed to update powerup inventory count.");
    }

    // --- Step 2: Update Active State --- 
    let activeUpdateOperation: any = {};
    let finalActivatedPowerupState: ActivePowerup | null = null;
    const activeIndex = userPowerups.findIndex(p => p.id === powerupId && p.isActive);
    let newActiveUntil: Date;

    if (activeIndex > -1) {
      // Extend the existing active powerup
      const currentActive = userPowerups[activeIndex];
      const currentActiveUntil = new Date(currentActive.activeUntil).getTime();
      const now = Date.now();
      const baseTime = currentActiveUntil > now ? currentActiveUntil : now;
      newActiveUntil = new Date(baseTime + addedDurationMs);
      activeUpdateOperation = { $set: { [`activePowerups.${activeIndex}.activeUntil`]: newActiveUntil } };
      finalActivatedPowerupState = { ...currentActive, activeUntil: newActiveUntil }; 
       console.log(`[Activate Powerup] Step 2: Extending active powerup ${powerupId} to ${newActiveUntil}`);
    } else {
      // Activate a new powerup from inventory
      newActiveUntil = new Date(Date.now() + addedDurationMs);
      const newActivePowerup = {
        ...inventoryPowerup,
        isActive: true,
        activeUntil: newActiveUntil,
        remainingTime: Math.max(0, addedDurationMs / 1000),
        count: undefined
      };
      activeUpdateOperation = { $push: { activePowerups: newActivePowerup } };
      finalActivatedPowerupState = newActivePowerup;
       console.log(`[Activate Powerup] Step 2: Pushing new active powerup ${powerupId}, expires ${newActiveUntil}`);
    }
    
    // Execute the active state update
    const activeUpdateResult = await usersCollection.updateOne(userFilter, activeUpdateOperation);
    console.log(`[Activate Powerup] Step 2 Result:`, activeUpdateResult);

    // Check if the active update seemed successful
    if (activeUpdateResult.modifiedCount === 0 && activeUpdateResult.matchedCount === 0 && !activeUpdateResult.upsertedId) {
         console.error(`[Activate Powerup] Failed Step 2: Active state update for ${powerupId}`);
        // Note: At this point, inventory was already updated. Might need a compensating action in a real system.
        throw new Error("Failed to update active powerup state after inventory was modified.");
    }

    // Fetch the updated user powerups to return the latest state
    const updatedUser = await usersCollection.findOne(userFilter);
    const finalPowerups = updatedUser?.activePowerups || [];
    console.log(`[Activate Powerup] Final powerups state for User ${userId}:`, JSON.stringify(finalPowerups, null, 2));
    // --- End Database Updates ---

    console.log(`User ${userId} activated ${activationCount} of ${powerupId}.`);

    return NextResponse.json({
      success: true,
      message: `Successfully activated ${activationCount} ${inventoryPowerup.name} powerup(s)`,
      allPowerups: finalPowerups // Return the full list
    });
      
  } catch (error) {
    console.error('Error in activate powerup endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during powerup activation' },
      { status: 500 }
    );
  }
} 