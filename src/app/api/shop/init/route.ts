import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { StoreItem } from '@/types/store';

// Default store items
const defaultItems: StoreItem[] = [
  {
    id: 'coin-boost-1.5x',
    name: '1.5x Coin Boost',
    description: 'Earn 1.5x more coins for every correct answer for 30 minutes',
    price: 1,
    priceType: 'token',
    type: 'multiplier',
    duration: 30, // 30 minutes
    value: 1.5,
    image: '/images/shop/boost-1.5x.png'
  },
  {
    id: 'coin-boost-2x',
    name: '2x Coin Boost',
    description: 'Earn 2x more coins for every correct answer for 30 minutes',
    price: 2,
    priceType: 'token',
    type: 'multiplier',
    duration: 30, // 30 minutes
    value: 2,
    image: '/images/shop/boost-2x.png'
  },
  {
    id: 'coin-boost-30m',
    name: '30-Minute Coin Boost',
    description: 'Earn 1.25x more coins for every correct answer for 30 minutes',
    price: 300,
    priceType: 'coin',
    type: 'multiplier',
    duration: 30, // 30 minutes
    value: 1.25,
    image: '/images/shop/timer-30.png'
  },
  {
    id: 'coin-boost-60m',
    name: '60-Minute Coin Boost',
    description: 'Earn 1.5x more coins for every correct answer for 60 minutes',
    price: 500,
    priceType: 'coin',
    type: 'multiplier',
    duration: 60, // 60 minutes
    value: 1.5,
    image: '/images/shop/timer-60.png'
  }
];

export async function GET() {
  try {
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if store items collection exists
    const collections = await db.listCollections({ name: 'storeItems' }).toArray();
    
    if (collections.length === 0) {
      // Collection doesn't exist, create it and insert default items
      await db.createCollection('storeItems');
      await db.collection('storeItems').insertMany(defaultItems);
    } else {
      // Collection exists, check if it has items
      const count = await db.collection('storeItems').countDocuments();
      
      if (count === 0) {
        // No items, insert default ones
        await db.collection('storeItems').insertMany(defaultItems);
      }
    }
    
    // Get all store items
    const storeItems = await db.collection('storeItems').find().toArray();
    
    return NextResponse.json({
      success: true,
      items: storeItems
    });
    
  } catch (error) {
    console.error('Error initializing store items:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while initializing store items' },
      { status: 500 }
    );
  }
} 