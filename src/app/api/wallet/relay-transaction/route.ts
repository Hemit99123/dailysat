import { NextResponse } from 'next/server';
import axios from 'axios';
import { Transaction } from '@solana/web3.js';

// You need to get a Helius API key from https://dev.helius.xyz/
// Then add it to your .env.local file as HELIUS_API_KEY
// Documentation: https://docs.helius.dev/solana-rpc-nodes/rpc-relay
const HELIUS_API_KEY = process.env.HELIUS_API_KEY || 'YOUR_HELIUS_API_KEY';

// Standard Helius RPC endpoint for sending transactions
const HELIUS_ENDPOINT = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function POST(req: Request) {
  try {
    const { userSignedTransaction, userWallet } = await req.json();

    if (!userSignedTransaction || !userWallet) {
      return NextResponse.json(
        { success: false, message: 'Missing signed transaction or user wallet address' },
        { status: 400 }
      );
    }

    // Verify Helius API key is set
    if (!HELIUS_API_KEY || HELIUS_API_KEY === 'YOUR_HELIUS_API_KEY') {
      console.error('Missing or invalid Helius API key');
      return NextResponse.json(
        { success: false, message: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    try {
      // Log the transaction data we're about to process
      console.log('Processing signed transaction:', {
        transactionLength: userSignedTransaction.length,
        walletAddress: userWallet
      });

      // Deserialize the transaction to inspect it
      try {
        // Deserialize the user's transaction
        const transactionBuffer = Buffer.from(userSignedTransaction, 'base64');
        const transaction = Transaction.from(transactionBuffer);
        
        console.log('Transaction details:', {
          numSignatures: transaction.signatures.length,
          blockhash: transaction.recentBlockhash,
          feePayer: transaction.feePayer?.toBase58() || 'none',
          numInstructions: transaction.instructions.length
        });

        // Send the transaction directly - don't try to change the fee payer
        console.log('Sending transaction to Helius RPC...');
        
        const response = await axios.post(
          HELIUS_ENDPOINT,
          {
            jsonrpc: "2.0",
            id: "relay-transaction",
            method: "sendTransaction",
            params: [
              userSignedTransaction,
              {
                encoding: "base64",
                skipPreflight: false, // Don't skip preflight to catch errors early
                preflightCommitment: "confirmed",
                maxRetries: 1
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Log the full response for debugging
        console.log('Full RPC response:', JSON.stringify(response.data, null, 2));
        
        // Check for successful result (transaction signature)
        if (response.data.result) {
          console.log('Transaction sent successfully with signature:', response.data.result);
          return NextResponse.json({
            success: true,
            message: 'Transaction relayed successfully',
            signature: response.data.result
          });
        } 
        // Check for error response
        else if (response.data.error) {
          console.error('RPC error response:', response.data.error);
          
          // Extract error details
          const errorData = response.data.error.data || {};
          const errorMsg = response.data.error.message || '';
          const errorLogs = errorData.logs || [];
          console.log("Error logs:", errorLogs);
          
          // Check for specific error types in message and logs
          const isSignatureVerificationFailed = 
            errorMsg.includes("Signature verification failed") || 
            errorLogs.some((log: string) => log.includes("Signature verification failed"));
          
          const isBlockhashNotFound = errorData.err === 'BlockhashNotFound';
          
          const hasInsufficientFunds = errorLogs.some((log: string) => 
            log.includes("insufficient funds") || 
            log.includes("Insufficient lamports")
          );
          
          // Handle specific error cases with friendly messages
          if (isSignatureVerificationFailed) {
            return NextResponse.json({
              success: false,
              message: 'Transaction signature verification failed. The transaction must be signed by all required signers.',
              code: 'SIGNATURE_VERIFICATION_FAILED',
              details: { 
                logs: errorLogs,
                errorMessage: errorMsg
              }
            }, { status: 400 });
          }
          else if (isBlockhashNotFound) {
            return NextResponse.json({
              success: false,
              message: 'Transaction blockhash has expired. Please try again with a fresh transaction.',
              code: 'BLOCKHASH_EXPIRED',
              details: {
                originalBlockhash: transaction.recentBlockhash
              }
            }, { status: 400 });
          }
          else if (hasInsufficientFunds) {
            return NextResponse.json({
              success: false,
              message: 'Not enough SOL to pay for transaction fees',
              code: 'INSUFFICIENT_FUNDS',
              details: {
                logs: errorLogs
              }
            }, { status: 400 });
          }
          
          // General error fallback
          return NextResponse.json({
            success: false,
            message: `RPC Error: ${errorMsg}`,
            code: response.data.error.code,
            details: {
              logs: errorLogs,
              full: errorData
            }
          }, { status: 400 });
        } 
        // Unexpected response format
        else {
          console.error('Unexpected response format:', response.data);
          return NextResponse.json({
            success: false,
            message: 'Received unexpected response format from RPC'
          }, { status: 500 });
        }
      } catch (txError) {
        console.error('Failed to process transaction:', txError);
        return NextResponse.json({
          success: false,
          message: 'Failed to process transaction',
          error: txError instanceof Error ? txError.message : String(txError)
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error relaying transaction:', error);
      
      // Handle specific axios errors
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.error('Axios error details:', {
          status,
          data,
          url: error.config?.url || 'unknown'
        });
        
        // Provide specific error messages for common error codes
        let message = 'RPC service error';
        if (status === 401) {
          message = 'API authentication failed';
        } else if (status === 400) {
          message = 'Invalid transaction format or parameters';
        } else if (status === 429) {
          message = 'Rate limit exceeded';
        } else if (status >= 500) {
          message = 'RPC service is temporarily unavailable';
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message, 
            details: data,
            status
          },
          { status }
        );
      }
      
      return NextResponse.json(
        { success: false, message: error instanceof Error ? error.message : 'Error relaying transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in relay transaction endpoint:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while relaying the transaction' },
      { status: 500 }
    );
  }
} 