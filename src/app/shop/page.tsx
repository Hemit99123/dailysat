import React from 'react';
import { ShopItems } from '@/components/features/Shop/ShopItems';
import PowerupInventory from '@/components/features/Powerups/PowerupInventory';
import { fetchAllStoreItems } from '@/lib/store/storeUtils'; // Server-side utility
import { StoreItem } from '@/types/store';

import '@/styles/shop.css';

// Make this an async Server Component
export default async function Shop() {
  let coinItems: StoreItem[] = [];
  let fetchError = false;

  try {
    // Fetch all store items directly on the server
    const storeItems = await fetchAllStoreItems();
    
    // Filter out items that use token as payment (only show coin purchases)
    coinItems = storeItems.filter(item => item.priceType === 'coin');
  } catch (error) {
    console.error('[Shop Page] Error loading store items:', error);
    fetchError = true;
    // Optionally, you could redirect or show a specific error component
  }

  return (
    <main className="py-8 px-4 md:px-8 lg:px-16 bg-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-900">
          DailySAT Shop
        </h1>
        
        <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto">
          Use your hard-earned DailySAT coins to purchase powerups that give you an advantage!
        </p>
        
        {fetchError ? (
          <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow">
            <p>Failed to load shop items. Please try again later.</p>
          </div>
        ) : (
          // Pass fetched items to the Client Component
          <ShopItems items={coinItems} /> 
        )}
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-purple-900">Your Powerups</h2>
          {/* PowerupInventory is a Client Component, it gets user data from Zustand */}
          <PowerupInventory /> 
        </div>
        
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Shop Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All purchases are final and non-refundable</li>
            <li>Powerups are specific to your account and cannot be transferred</li>
            <li>Coins can be earned through daily activities and streaks</li>
            <li>New items are added regularly, so check back often!</li>
            <li>You can stack multiple of the same powerup to extend their duration</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
