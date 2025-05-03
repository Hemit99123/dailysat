'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user';
import { ActivePowerup } from '@/types/store';
import { formatTime } from '@/lib/utils';
import axios from 'axios';

export default function PowerupTimer() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState(false);

  // Fetch active powerups initially and every minute
  useEffect(() => {
    if (!user?._id) return;

    // Set a flag to avoid unnecessary API calls
    let isComponentMounted = true;
    let lastFetchTime = 0;
    const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const fetchPowerups = async () => {
      // Check if we need to fetch again (avoid frequent API calls)
      const now = Date.now();
      if (now - lastFetchTime < FETCH_INTERVAL && activePowerups.length > 0) {
        return;
      }
      
      try {
        // Only make API call if component is still mounted
        if (isComponentMounted) {
          const response = await axios.get(`/api/shop/active-powerups?userId=${user._id}`);
          if (response.data.success) {
            setActivePowerups(response.data.activePowerups);
            setError(false);
            
            // Update user store if powerups have changed
            if (user && JSON.stringify(user.activePowerups) !== JSON.stringify(response.data.activePowerups)) {
              setUser({
                ...user,
                activePowerups: response.data.activePowerups
              });
            }
            
            // Record last fetch time
            lastFetchTime = now;
          }
        }
      } catch (error) {
        console.error('Error fetching powerups:', error);
        if (isComponentMounted) {
          setError(true);
        }
      }
    };

    // Fetch immediately
    fetchPowerups();

    // Then fetch every 5 minutes instead of 30 seconds
    const interval = setInterval(fetchPowerups, FETCH_INTERVAL);
    
    return () => {
      isComponentMounted = false;
      clearInterval(interval);
    };
  }, [user?._id, setUser, user, activePowerups.length]);

  // Update timer countdown every second
  useEffect(() => {
    if (activePowerups.length === 0) return;

    const interval = setInterval(() => {
      setActivePowerups(prevPowerups => {
        // Reduce remaining time by 1 second for each powerup
        const updatedPowerups = prevPowerups.map(powerup => ({
          ...powerup,
          remainingTime: Math.max(0, powerup.remainingTime - 1)
        }));
        
        // Filter out expired powerups
        return updatedPowerups.filter(p => p.remainingTime > 0);
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activePowerups.length]);

  // If no active powerups or error loading, don't render anything
  if (!activePowerups || activePowerups.length === 0 || error) {
    return null;
  }

  // Get the highest multiplier powerup (if multiple are active)
  const activeMultipliers = activePowerups.filter(p => 
    (p.type === 'multiplier' || p.itemType === 'multiplier')
  );
  
  const highestMultiplier = activeMultipliers.length > 0 
    ? activeMultipliers.reduce((prev, current) => {
        const prevValue = prev.value || prev.itemValue || 1;
        const currentValue = current.value || current.itemValue || 1;
        return (prevValue > currentValue) ? prev : current;
      }) 
    : null;

  const powerupValue = highestMultiplier?.value || 
                        highestMultiplier?.itemValue || 1;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div 
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="text-xl">⚡</div>
        <div>
          {highestMultiplier && (
            <div className="font-bold">{powerupValue}x Boost</div>
          )}
          <div className="text-xs">
            {formatTime(highestMultiplier?.remainingTime || 0)}
          </div>
        </div>
      </div>

      {/* Tooltip with all active powerups */}
      {showTooltip && activePowerups.length > 0 && (
        <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 p-3 rounded-lg shadow-xl w-64">
          <h3 className="font-bold text-sm mb-2">Active Powerups</h3>
          <div className="space-y-2">
            {activePowerups.map((powerup, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{powerup.itemName || powerup.name}</span>
                <span>{formatTime(powerup.remainingTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 