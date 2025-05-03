import { User } from '@/types/user';
import { ActivePowerup } from '@/types/store';

// Simple in-memory store to simulate a database during development
// NOTE: This data will reset every time the server is *fully* stopped and restarted.

interface MockUserData {
  currency: number;
  powerups: ActivePowerup[]; // Holds both inventory and active powerups
}

// Define a type for the global object property to avoid TypeScript errors
declare global {
  var mockUserStore: Map<string, MockUserData> | undefined;
}

// Initialize the store on the global object if it doesn't exist
// This helps persist it across HMR updates in development
global.mockUserStore = global.mockUserStore || new Map<string, MockUserData>();

// Function to initialize or get user data from the mock store
export const getMockUserData = (userId: string, initialUser?: User | null): MockUserData => {
  if (!global.mockUserStore!.has(userId)) {
    console.log(`[Mock DB] Initializing store for user: ${userId}`);
    // Initialize with default values or from initial user data if provided
    global.mockUserStore!.set(userId, {
      currency: initialUser?.currency || 500, // Start with 500 coins if not specified
      // Ensure powerups are properly initialized, handling potential undefined/null
      powerups: initialUser?.activePowerups?.map(p => ({ ...p })) || [] 
    });
  } else {
    console.log(`[Mock DB] Getting existing store for user: ${userId}`);
  }
  // Use non-null assertion as we ensure it's initialized
  return global.mockUserStore!.get(userId)!; 
};

// Function to update user data in the mock store
export const updateMockUserData = (userId: string, updates: Partial<MockUserData>) => {
  if (global.mockUserStore!.has(userId)) {
    const currentData = global.mockUserStore!.get(userId)!;
    const updatedData = { ...currentData, ...updates };
    global.mockUserStore!.set(userId, updatedData);
    console.log(`[Mock DB] Updated data for user ${userId}:`, updatedData);
  } else {
     console.warn(`[Mock DB] Attempted to update non-existent user: ${userId}`);
  }
};

// Function to get all powerups (both inventory and active)
export const getMockUserPowerups = (userId: string): ActivePowerup[] => {
  return getMockUserData(userId).powerups;
};

// Function to get only active powerups
export const getMockUserActivePowerups = (userId: string): ActivePowerup[] => {
  return getMockUserData(userId).powerups.filter(p => p.isActive);
};

// Function to update a user's powerups
export const updateMockUserPowerups = (userId: string, powerups: ActivePowerup[]) => {
  // Ensure we create a new array/objects to avoid mutation issues
  const newPowerups = powerups.map(p => ({ ...p })); 
  updateMockUserData(userId, { powerups: newPowerups });
};

// Function to get user currency
export const getMockUserCurrency = (userId: string): number => {
  return getMockUserData(userId).currency;
};

// Function to update user currency
export const updateMockUserCurrency = (userId: string, currency: number) => {
  updateMockUserData(userId, { currency });
}; 