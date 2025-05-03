import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { TokenManager } from '@/lib/token/TokenManager';
import { initializeToken } from '@/lib/token/initToken';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Conversion rate: 10 DailySAT coins = 1 DailySAT Token
const CONVERSION_RATE = 10;

// Cache token info to avoid initializing for every request
let tokenInfo: { tokenMint: string; payerPublicKey: string; payerSecretKey: string } | null = null;

export async function POST(req: Request) {
  try {
    const { amount, walletAddress, userId } = await req.json();

    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid transfer amount' },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    
    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user and check if they have enough currency
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.currency < numAmount) {
      return NextResponse.json(
        { success: false, message: 'Insufficient DailySAT coins' },
        { status: 400 }
      );
    }

    // Calculate the amount of DailySAT Tokens that would be sent
    const tokenAmount = numAmount / CONVERSION_RATE;
    let transactionResult;
    let solanaExplorerUrl = '';
    
    try {
      // Initialize token if not already initialized
      if (!tokenInfo) {
        try {
          tokenInfo = await initializeToken();
        } catch (error) {
          console.error('Error initializing token, trying to load from .env.local:', error);
          // If initialization fails but we have the required env variables, use those
          const { SOLANA_TOKEN_MINT, SOLANA_PAYER_PUBLIC_KEY, SOLANA_PAYER_SECRET_KEY } = process.env;
          if (SOLANA_TOKEN_MINT && SOLANA_PAYER_PUBLIC_KEY && SOLANA_PAYER_SECRET_KEY) {
            tokenInfo = {
              tokenMint: SOLANA_TOKEN_MINT,
              payerPublicKey: SOLANA_PAYER_PUBLIC_KEY,
              payerSecretKey: SOLANA_PAYER_SECRET_KEY
            };
            console.log('Using token info from environment variables');
          } else {
            throw new Error('Could not initialize token and no fallback available');
          }
        }
      }
      
      // Create token manager with saved token info
      const tokenManager = new TokenManager(tokenInfo.payerSecretKey);
      tokenManager.setTokenMint(tokenInfo.tokenMint);
      
      // Check balance before attempting to send tokens
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const balance = await connection.getBalance(tokenManager.getPayer().publicKey);
      
      if (balance < 0.01 * LAMPORTS_PER_SOL) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'The server wallet has insufficient SOL for the transaction. Please try again later or request tokens at https://faucet.solana.com' 
          },
          { status: 503 }
        );
      }
      
      // Send tokens to recipient
      console.log(`Sending ${tokenAmount} DailySAT Tokens to ${walletAddress}`);
      transactionResult = await tokenManager.sendTokens(walletAddress, tokenAmount);
      
      solanaExplorerUrl = `https://explorer.solana.com/tx/${transactionResult.signature}?cluster=devnet`;
      console.log('Transaction successful:', transactionResult.signature);
      console.log('Token account created/used:', transactionResult.tokenAccount);
    } catch (error) {
      console.error('Error sending tokens:', error);
      let errorMessage = 'Error sending tokens to wallet';
      
      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('429')) {
        errorMessage = 'The Solana network is experiencing high demand. Please try again later.';
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 500 }
      );
    }

    // Create transaction data object
    const transactionData = {
      type: 'wallet_transfer',
      amount: numAmount,
      tokenAmount,
      walletAddress,
      signature: transactionResult.signature,
      tokenAccount: transactionResult.tokenAccount,
      solanaExplorerUrl,
      timestamp: new Date()
    };

    // Update user's currency and save wallet address
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { currency: -numAmount },
        $set: { 
          phantomWallet: walletAddress,
          lastTransaction: transactionData
        }
      }
    );

    // Store transaction in separate transactions collection for history
    await db.collection('transactions').insertOne({
      userId: new ObjectId(userId),
      ...transactionData
    });

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${numAmount} DailySAT coins (${tokenAmount} DailySAT Tokens) to wallet`,
      signature: transactionResult.signature,
      solanaExplorerUrl,
      tokenMint: tokenInfo.tokenMint,
      tokenAccount: transactionResult.tokenAccount,
      tokenAmount
    });
  } catch (error) {
    console.error('Error in wallet transfer:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during the transfer' },
      { status: 500 }
    );
  }
} 