import { client } from './mongo';
import { Db } from 'mongodb';

export async function connectToDatabase() {
  try {
    await client.connect();
    const db: Db = client.db("DailySAT");
    return { db, client };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Unable to connect to MongoDB');
  }
} 