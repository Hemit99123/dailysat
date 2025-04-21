import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  clusterApiUrl,
  SystemProgram
} from '@solana/web3.js';

export async function POST(req: Request) {
  try {
    const { walletAddress, amount, itemId } = await req.json();

    // Validate input
    if (!walletAddress || !amount || !itemId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    try {
      new PublicKey(walletAddress);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find store item to validate it exists and can be purchased with tokens
    const storeItem = await db.collection('storeItems').findOne({ id: itemId });
    if (!storeItem) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Verify the item can be purchased with tokens
    if (storeItem.priceType !== 'token') {
      return NextResponse.json(
        { success: false, message: 'This item requires DailySAT coins, not tokens' },
        { status: 400 }
      );
    }

    try {
      // Connect to Solana devnet
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Get a recent blockhash for the transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      
      // Create the transaction with user as fee payer
      const userPublicKey = new PublicKey(walletAddress);
      
      // IMPORTANT: For sponsored transactions, we initially set the user as fee payer
      // The backend relay service will handle the sponsoring part after the user signs
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: userPublicKey // User is fee payer initially
      });
      
      // Add a dummy instruction to ensure the transaction is valid
      // In production, you would add your actual token transfer instruction here
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: userPublicKey, 
          toPubkey: userPublicKey,
          lamports: 0 // Zero-lamport transfer (dummy instruction)
        })
      );
      
      // Log transaction details for debugging
      console.log('Creating transaction:', {
        blockhash,
        feePayer: transaction.feePayer?.toBase58(),
        userWallet: userPublicKey.toBase58(),
        numInstructions: transaction.instructions.length
      });
      
      // Serialize the transaction for user to sign
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      }).toString('base64');

      // Return the transaction for the user to sign, then they'll send it back to relay endpoint
      return NextResponse.json({
        success: true,
        message: 'Transaction created for user signature',
        serializedTransaction,
        // Include metadata to help with relay processing
        relayInstructions: {
          nextStep: 'collect_signature_and_relay',
          blockhash,
          lastValidBlockHeight,
          userWallet: walletAddress
        }
      });
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      return NextResponse.json(
        { success: false, message: error instanceof Error ? error.message : 'Error creating transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in create transaction endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while creating the transaction' },
      { status: 500 }
    );
  }
} 