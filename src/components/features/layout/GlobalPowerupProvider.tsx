'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/store/user';
import { ActivePowerup } from '@/types/store';
import axios from 'axios';

// Global cache to prevent duplicate API calls
const GLOBAL_CACHE = {
  activePowerups: null as ActivePowerup[] | null,
  lastFetched: 0,
  isFetching: false,
  listeners: new Set<() => void>()
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Context for active powerups
interface PowerupContextType {
  activePowerups: ActivePowerup[];
  loading: boolean;
  error: boolean;
  refreshPowerups: () => Promise<void>;
  getHighestMultiplier: () => number;
}

const PowerupContext = createContext<PowerupContextType>({
  activePowerups: [],
  loading: true,
  error: false,
  refreshPowerups: async () => {},
  getHighestMultiplier: () => 1
});

export const usePowerups = () => useContext(PowerupContext);

export function GlobalPowerupProvider({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const componentMounted = useRef(true);

  // Global fetch function that uses a shared cache
  const fetchPowerups = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    // Check if we have fresh data in cache
    const now = Date.now();
    if (GLOBAL_CACHE.activePowerups && now - GLOBAL_CACHE.lastFetched < CACHE_DURATION) {
      // Use cached data
      setActivePowerups(GLOBAL_CACHE.activePowerups);
      setLoading(false);
      setError(false);
      
      // Update user store if needed
      if (user && JSON.stringify(user.activePowerups) !== JSON.stringify(GLOBAL_CACHE.activePowerups)) {
        setUser({
          ...user,
          activePowerups: GLOBAL_CACHE.activePowerups
        });
      }
      return;
    }

    // If another component is already fetching, wait for it to complete
    if (GLOBAL_CACHE.isFetching) {
      // Add this component as a listener
      const updateListener = () => {
        if (componentMounted.current && GLOBAL_CACHE.activePowerups) {
          setActivePowerups(GLOBAL_CACHE.activePowerups);
          setLoading(false);
          setError(false);
          
          // Update user store if needed
          if (user && JSON.stringify(user.activePowerups) !== JSON.stringify(GLOBAL_CACHE.activePowerups)) {
            setUser({
              ...user,
              activePowerups: GLOBAL_CACHE.activePowerups
            });
          }
        }
      };
      
      GLOBAL_CACHE.listeners.add(updateListener);
      return;
    }

    // Mark as fetching to prevent duplicate requests
    GLOBAL_CACHE.isFetching = true;

    try {
      console.log('Fetching powerups from API - this should only happen once every 5 minutes');
      const response = await axios.get(`/api/shop/active-powerups?userId=${user._id}`);
      
      // Update global cache
      if (response.data.success) {
        GLOBAL_CACHE.activePowerups = response.data.activePowerups;
        GLOBAL_CACHE.lastFetched = now;
        
        // Update this component
        if (componentMounted.current) {
          setActivePowerups(response.data.activePowerups);
          setError(false);
          
          // Update user store if needed
          if (user && JSON.stringify(user.activePowerups) !== JSON.stringify(response.data.activePowerups)) {
            setUser({
              ...user,
              activePowerups: response.data.activePowerups
            });
          }
        }
        
        // Notify all listeners
        GLOBAL_CACHE.listeners.forEach(listener => listener());
      }
    } catch (err) {
      console.error('Error fetching powerups:', err);
      if (componentMounted.current) {
        setError(true);
      }
    } finally {
      setLoading(false);
      GLOBAL_CACHE.isFetching = false;
      GLOBAL_CACHE.listeners.clear();
    }
  };

  // One-time setup and periodic refresh
  useEffect(() => {
    fetchPowerups();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPowerups, CACHE_DURATION);
    
    return () => {
      componentMounted.current = false;
      clearInterval(interval);
    };
  }, [user?._id]); // Dependency on user ID only, not on active powerups

  // Countdown timer logic
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

  // Get the highest multiplier value from active powerups
  const getHighestMultiplier = () => {
    if (!activePowerups || activePowerups.length === 0) return 1;
    
    const activeMultipliers = activePowerups.filter(p => 
      (p.type === 'multiplier' || p.itemType === 'multiplier')
    );
    
    if (activeMultipliers.length === 0) return 1;
    
    const highestMultiplier = activeMultipliers.reduce((prev, current) => {
      const prevValue = prev.value || prev.itemValue || 1;
      const currentValue = current.value || current.itemValue || 1;
      return (prevValue > currentValue) ? prev : current;
    });
    
    return highestMultiplier.value || highestMultiplier.itemValue || 1;
  };

  return (
    <PowerupContext.Provider 
      value={{ 
        activePowerups, 
        loading, 
        error, 
        refreshPowerups: fetchPowerups,
        getHighestMultiplier
      }}
    >
      {children}
      {/* PowerupTimer component is no longer needed - this provider handles everything */}
    </PowerupContext.Provider>
  );
} 