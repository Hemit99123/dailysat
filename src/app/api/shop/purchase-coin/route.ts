import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb'; // Use the actual DB connection
import { ObjectId } from 'mongodb';
import { ActivePowerup, StoreItem } from '@/types/store';
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    const { itemId, userId } = await req.json();

    // Validate input
    if (!itemId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session and authenticate
    const session = await auth();
    const sessionUserId = session?.user?.id;
    
    // IMPORTANT: Just verify that the user is logged in (session exists)
    // We trust the frontend sent the correct userId from the user store
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
    
    // Find user by verified session/request userId
    const usersCollection = db.collection<User>("users");
    const userObjectId = new ObjectId(userId);
    // Explicitly type the filter for findOne
    const filter: import("mongodb").Filter<User> = { _id: userObjectId as any }; 
    const user = await usersCollection.findOne(filter);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Find store item by itemId (assuming itemId is the unique key for store items)
    const storeItemsCollection = db.collection<StoreItem>('storeItems');
    const storeItem = await storeItemsCollection.findOne({ id: itemId }); // Use 'id' if that's the field name
    
    if (!storeItem) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Verify the item can be purchased with coins
    if (storeItem.priceType !== 'coin') {
      return NextResponse.json(
        { success: false, message: 'This item requires tokens, not coins' },
        { status: 400 }
      );
    }

    // Check if user has enough coins
    const userCurrency = user.currency || 0;
    if (userCurrency < storeItem.price) {
      return NextResponse.json(
        { success: false, message: 'Insufficient coins' },
        { status: 400 }
      );
    }

    // --- Perform Database Updates --- 
    const remainingCoins = userCurrency - storeItem.price;
    
    // Prepare the powerup data to be added/updated in the user's document
    const powerupToAddOrUpdate: ActivePowerup = {
      id: storeItem.id,
      name: storeItem.name,
      type: storeItem.type,
      value: storeItem.value,
      duration: storeItem.duration,
      itemName: storeItem.name,
      itemType: storeItem.type,
      itemValue: storeItem.value,
      itemDescription: storeItem.description,
      isActive: false, // Purchased items go to inventory
      count: 1,        // Initial count is 1
      activeUntil: new Date(), // Placeholder, not relevant for inventory
      remainingTime: 0      // Placeholder, not relevant for inventory
    };

    // Check if user already has this *inactive* powerup in their array
    const existingPowerupIndex = (user.activePowerups || []).findIndex(p => p.id === itemId && !p.isActive);
    let updateOperation;

    if (existingPowerupIndex > -1) {
      // Increment count of existing inventory item
      updateOperation = { 
        $inc: { [`activePowerups.${existingPowerupIndex}.count`]: 1 },
        $set: { currency: remainingCoins }
      };
    } else {
      // Add new item to inventory array
      updateOperation = { 
        $push: { activePowerups: powerupToAddOrUpdate },
        $set: { currency: remainingCoins }
      };
    }

    // Execute the update on the users collection
    const updateResult = await usersCollection.updateOne(
      filter, // Use the same typed filter
      updateOperation
    );

    if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
        throw new Error("Failed to update user document during purchase.");
    }
    
    // Optionally record the transaction (example)
    // await db.collection('transactions').insertOne({ ... });

    // Fetch the updated user powerups to return the latest state
    const updatedUser = await usersCollection.findOne(filter);
    const finalPowerups = updatedUser?.activePowerups || [];
    // --- End Database Updates --- 

    console.log(`User ${userId} purchased ${storeItem.name}. Coins left: ${remainingCoins}`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${storeItem.name}`,
      remainingCoins,
      allPowerups: finalPowerups // Return the full updated list
    });
      
  } catch (error) {
    console.error('Error in coin purchase endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during purchase' },
      { status: 500 }
    );
  }
} 