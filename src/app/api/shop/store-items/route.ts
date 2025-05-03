import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock store items
    const storeItems = [
      {
        id: "boost-2x",
        name: "2x Multiplier",
        description: "Double your coin earnings for a limited time",
        price: 100,
        priceType: "coin", 
        type: "multiplier",
        duration: 30,
        value: 2,
        image: "https://via.placeholder.com/300"
      },
      {
        id: "boost-5x",
        name: "5x Multiplier",
        description: "Multiply your coin earnings by 5 for a limited time",
        price: 300,
        priceType: "coin",
        type: "multiplier",
        duration: 30,
        value: 5,
        image: "https://via.placeholder.com/300"
      },
      {
        id: "theme-dark",
        name: "Dark Theme",
        description: "Unlock dark theme for the app",
        price: 500,
        priceType: "coin",
        type: "theme",
        value: 1,
        image: "https://via.placeholder.com/300"
      },
      {
        id: "token-100",
        name: "100 Tokens",
        description: "Purchase 100 DailySAT tokens for advanced features",
        price: 10,
        priceType: "coin",
        type: "token",
        value: 100,
        image: "https://via.placeholder.com/300"
      }
    ];
    
    return NextResponse.json({
      success: true,
      items: storeItems
    });
    
  } catch (error) {
    console.error('Error fetching store items:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching store items' },
      { status: 500 }
    );
  }
} 