export type StoreItemType = 'boost' | 'multiplier' | 'theme' | 'avatar';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: 'coin' | 'token'; // Payment in app coins or Solana tokens
  type: StoreItemType;
  duration?: number; // Duration in minutes (for time-based items)
  value: number; // Multiplier value for boosts, or other numeric value
  image: string;
}

export interface UserPowerup {
  userId: string;
  itemId: string;
  activeUntil: Date; // When the powerup expires
  purchasedAt: Date; // When the powerup was purchased
  isActive: boolean;
  value: number; // The multiplier or other value
  type: StoreItemType;
}

export interface ActivePowerup {
  id: string;
  name: string;
  type: StoreItemType;
  value: number;
  activeUntil: Date;
  remainingTime: number; // Seconds remaining
  duration?: number; // Duration in minutes
  
  // Additional properties for display in the dashboard
  itemName?: string;
  itemType?: StoreItemType;
  itemValue?: number;
  itemDescription?: string;
  
  // Inventory tracking
  count?: number; // Number of this powerup owned by the user
  isActive?: boolean; // Whether this powerup is currently active
} 