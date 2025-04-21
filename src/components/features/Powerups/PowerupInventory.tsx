'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/user';
import { ActivePowerup } from '@/types/store';
import { toast } from 'react-toastify';
import axios from 'axios';

// Renamed to better reflect its purpose
export default function InventoryList() { 
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({}); // Loading state per item
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>({});

  // Get only powerups in inventory (not active)
  const inventoryPowerups = user?.activePowerups?.filter(p => !p.isActive) || [];

  // Increase count for a particular powerup
  const increaseCount = (powerupId: string, maxCount: number) => {
    setSelectedCounts(prev => ({
      ...prev,
      [powerupId]: Math.min(maxCount, (prev[powerupId] || 1) + 1)
    }));
  };

  // Decrease count for a particular powerup
  const decreaseCount = (powerupId: string) => {
    setSelectedCounts(prev => ({
      ...prev,
      [powerupId]: Math.max(1, (prev[powerupId] || 1) - 1)
    }));
  };

  // Get the display count for a powerup (defaults to 1)
  const getCount = (powerupId: string) => {
    return selectedCounts[powerupId] || 1;
  };

  // Use a powerup
  const usePowerup = async (powerup: ActivePowerup) => {
    if (!user?._id) return;
    
    setIsLoading(prev => ({ ...prev, [powerup.id]: true }));
    const countToActivate = getCount(powerup.id);
    
    try {
      // Call API to activate powerup(s)
      const response = await axios.post('/api/shop/activate-powerup', {
        userId: user._id,
        powerupId: powerup.id,
        count: countToActivate
      });
      
      if (response.data.success) {
        toast.success(`Activated ${countToActivate} ${powerup.name} powerup${countToActivate > 1 ? 's' : ''}!`);
        
        // Update user state with the full list from the API
        setUser({
          ...user,
          activePowerups: response.data.allPowerups // Use the complete list from API
        });
        
        // Reset the count for this powerup
        setSelectedCounts(prev => ({
          ...prev,
          [powerup.id]: 1 
        }));
        
        console.log("User state updated after activation:", useUserStore.getState().user);
      }
    } catch (error: any) {
      console.error('Error activating powerup:', error);
      const message = error.response?.data?.message || 'Failed to activate powerup';
      toast.error(message);
    } finally {
      setIsLoading(prev => ({ ...prev, [powerup.id]: false }));
    }
  };

  if (!user) {
    // Should not happen if rendered within dashboard, but good practice
    return null; 
  }

  if (inventoryPowerups.length === 0) {
     return (
       <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
         <p className="text-gray-600 mb-4">You don't have any powerups in your inventory.</p>
       </div>
     );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {inventoryPowerups.map((powerup) => {
        const currentCountInInventory = powerup.count || 1;
        const countToUse = getCount(powerup.id);
        const itemIsLoading = isLoading[powerup.id] || false;

        return (
          <div 
            key={powerup.id} 
            className="bg-white rounded-lg p-4 shadow border border-gray-200 flex flex-col justify-between"
          >
            <div> {/* Top section for details */} 
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{powerup.name}</h3>
                  <p className="text-sm text-gray-600">
                    {powerup.type === 'multiplier' 
                      ? `${powerup.value}x boost for ${powerup.duration || 30} minutes` 
                      : powerup.itemDescription || 'Enhances your learning experience'}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                  Owned: {currentCountInInventory}
                </div>
              </div>
            </div>
            
            <div> {/* Bottom section for controls */} 
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => decreaseCount(powerup.id)}
                    disabled={countToUse <= 1 || itemIsLoading}
                    className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="font-medium text-lg w-6 text-center">{countToUse}</span>
                  <button 
                    onClick={() => increaseCount(powerup.id, currentCountInInventory)}
                    disabled={countToUse >= currentCountInInventory || itemIsLoading}
                    className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => usePowerup(powerup)}
                  disabled={itemIsLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait min-w-[80px] text-center"
                >
                  {itemIsLoading ? (
                    <div className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Use'
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 