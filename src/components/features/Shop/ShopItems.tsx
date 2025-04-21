'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/user';
import axios from 'axios';
import { StoreItem } from '@/types/store';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ShopItemsProps {
  items: StoreItem[];
}

export const ShopItems: React.FC<ShopItemsProps> = ({ items }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Handle purchase with coins
  const handleCoinPurchase = async (item: StoreItem) => {
    if (!user) {
      toast.error('Please sign in to make a purchase');
      return;
    }

    if (user.currency < item.price) {
      toast.error(`Not enough coins. You need ${item.price} coins.`);
      return;
    }

    // Show confirmation dialog
    setSelectedItemId(item.id);
    const confirmed = window.confirm(
      `Do you want to purchase ${item.name} for ${item.price} coins?`
    );
    
    if (!confirmed) {
      setSelectedItemId(null);
      return;
    }

    setIsPurchasing(true);

    try {
      const response = await axios.post('/api/shop/purchase-coin', {
        itemId: item.id,
        userId: user._id,
      });

      if (response.data.success) {
        toast.success(`Successfully purchased ${item.name}!`);
        
        // Update user state using the full list returned by the API
        setUser({
          ...user,
          currency: response.data.remainingCoins,
          activePowerups: response.data.allPowerups // Use the complete list from API
        });
        console.log("User state updated after purchase:", useUserStore.getState().user);
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      toast.error('Failed to complete purchase');
    } finally {
      setIsPurchasing(false);
      setSelectedItemId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-600">No items available in the shop right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* User balance info */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-purple-800">Your Balance</h2>
          <p className="text-xl font-bold">{user?.currency || 0} <span className="text-amber-600">Coins</span></p>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Dashboard
        </button>
      </div>

      {/* Store items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-102">
            <div className="h-48 bg-gray-200 relative">
              {item.image ? (
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">
                  {item.type === 'multiplier' ? '⚡' : '🎁'}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                {item.duration} min
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="font-bold text-amber-600">
                  {item.price} Coins
                </div>
                
                <button
                  onClick={() => handleCoinPurchase(item)}
                  disabled={isPurchasing || (!user?._id) || ((user?.currency || 0) < item.price)}
                  className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors
                    ${isPurchasing && selectedItemId === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isPurchasing && selectedItemId === item.id ? 'Purchasing...' : 'Purchase'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 