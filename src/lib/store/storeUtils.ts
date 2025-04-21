import { connectToDatabase } from '@/lib/mongodb';
import { StoreItem } from '@/types/store';

/**
 * Fetches all store items from the database
 * 
 * @returns Array of StoreItem objects
 */
export async function fetchAllStoreItems(): Promise<StoreItem[]> {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Fetch all store items
    const storeItems = await db.collection('storeItems').find({}).toArray();
    
    // Convert MongoDB objects to StoreItem type and ensure all fields are present
    return storeItems.map(item => ({
      id: item.id, // Assuming the DB stores 'id' as the unique identifier we use
      name: item.name,
      description: item.description,
      price: item.price,
      priceType: item.priceType || 'coin', // Default to coin if not specified
      type: item.type || 'multiplier', // Default to multiplier if not specified
      value: item.value || 1, // Default to 1 if not specified
      duration: item.duration || 30, // Default to 30 minutes if not specified
      image: item.image || ""
    }));
  } catch (error) {
    console.error('Error fetching store items:', error);
    return []; // Return empty array on error
  }
} 