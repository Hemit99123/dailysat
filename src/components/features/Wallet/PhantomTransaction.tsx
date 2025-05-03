'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import { toast } from 'react-toastify';

interface PhantomTransactionProps {
  itemId: string;
  amount: number;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

export const PhantomTransaction: React.FC<PhantomTransactionProps> = ({
  itemId,
  amount,
  onSuccess,
  onError
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [walletStatus, setWalletStatus] = useState('Checking wallet...');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_COUNT = 2;

  // Check wallet connection status
  useEffect(() => {
    if (connected && publicKey) {
      setWalletStatus(`Wallet connected: ${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`);
    } else {
      setWalletStatus('Wallet not connected. Please connect your Phantom wallet first.');
    }
  }, [connected, publicKey]);

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      toast.error('Wallet not connected');
      return;
    }

    if (!signTransaction) {
      toast.error('Wallet does not support signing');
      return;
    }

    setIsLoading(true);
    setRetryCount(0);
    await initiateTransaction();
  };

  const initiateTransaction = async () => {
    try {
      toast.info('Preparing transaction...');
      
      // Step 1: Get transaction from our API
      const createTxResponse = await axios.post('/api/wallet/create-transaction', {
        walletAddress: publicKey?.toString(),
        amount,
        itemId
      });

      if (!createTxResponse.data.success) {
        throw new Error(createTxResponse.data.message || 'Failed to create transaction');
      }

      toast.info('Please approve the transaction in your wallet');
      
      // Step 2: Deserialize the transaction
      const serializedTransaction = createTxResponse.data.serializedTransaction;
      const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
      const transaction = Transaction.from(transactionBuffer);

      console.log('Transaction prepared:', {
        publicKey: publicKey?.toString(),
        blockhash: transaction.recentBlockhash,
        serializedLength: serializedTransaction.length,
        feePayer: transaction.feePayer?.toBase58()
      });

      // Step 3: Have the user sign the transaction
      if (!signTransaction) {
        throw new Error('Wallet does not support signing');
      }
      const signedTransaction = await signTransaction(transaction);
      
      toast.info('Transaction signed, relaying to network...');
      
      // Step 4: Convert the signed transaction to base64
      const serializedSignedTransaction = signedTransaction.serialize().toString('base64');

      console.log('Transaction signed, length:', serializedSignedTransaction.length);

      // Step 5: Send to our relay API to handle the fee payment and relay
      try {
        const relayResponse = await axios.post('/api/wallet/relay-transaction', {
          userSignedTransaction: serializedSignedTransaction,
          userWallet: publicKey?.toString(),
        });

        if (!relayResponse.data.success) {
          // Check for specific error codes
          const errorCode = relayResponse.data.code;
          
          // Handle blockhash expired error - retry with a fresh transaction
          if (errorCode === 'BLOCKHASH_EXPIRED' && retryCount < MAX_RETRY_COUNT) {
            console.log('Blockhash expired, retrying with fresh transaction...');
            toast.info('Transaction needs to be refreshed. Please approve again.');
            
            // Increment retry count and try again with a fresh transaction
            setRetryCount(prev => prev + 1);
            await initiateTransaction();
            return;
          }
          // Handle signature verification error
          else if (errorCode === 'SIGNATURE_VERIFICATION_FAILED') {
            toast.error('Transaction signature verification failed. Please try again.');
          }
          // Handle insufficient funds error
          else if (errorCode === 'INSUFFICIENT_FUNDS') {
            toast.error('Not enough SOL to pay for transaction fees.');
          }
          // General error case
          else {
            throw new Error(relayResponse.data.message || 'Failed to relay transaction');
          }
        } else {
          // Step 6: Handle success
          const signature = relayResponse.data.signature;
          toast.success('Purchase successful!');
          if (onSuccess) {
            onSuccess(signature);
          }
          return; // Exit function on success
        }
      } catch (relayError) {
        console.error('Relay error:', relayError);
        
        // Handle Axios error with more details
        if (axios.isAxiosError(relayError) && relayError.response) {
          const errorDetails = relayError.response.data?.details || {};
          const errorStatus = relayError.response.status;
          const errorCode = relayError.response.data?.code;
          
          console.error('Relay API error details:', {
            status: errorStatus,
            code: errorCode,
            details: errorDetails
          });
          
          // Handle specific error codes
          if (errorStatus === 401) {
            toast.error('API authentication failed. Please contact support.');
          } else if (errorCode === 'BLOCKHASH_EXPIRED' && retryCount < MAX_RETRY_COUNT) {
            console.log('Blockhash expired, retrying with fresh transaction...');
            toast.info('Transaction needs to be refreshed. Please approve again.');
            
            // Increment retry count and try again with a fresh transaction
            setRetryCount(prev => prev + 1);
            await initiateTransaction();
            return;
          } else {
            toast.error(relayError.response.data?.message || 'Unknown error');
          }
        } else {
          toast.error(relayError instanceof Error ? relayError.message : 'Failed to relay transaction');
        }
      }
      
      // If we get here, the transaction wasn't successful
      if (onError) {
        onError(new Error('Transaction failed'));
      }
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during purchase';
      toast.error(errorMessage);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">Confirm Token Purchase</h3>
          <button 
            onClick={() => onError && onError(new Error('User canceled'))}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">{amount} DSAT Token</span>
          </div>
          
          <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
            <p className="font-medium">Wallet Status: </p>
            <p className={connected ? "text-green-600" : "text-red-600"}>
              {walletStatus}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md text-sm mb-4">
          <p className="font-medium text-blue-700">Transaction Information</p>
          <p className="text-blue-600 mt-1">
            • You&apos;ll need to approve this transaction with your wallet
          </p>
          <p className="text-blue-600">
            • A small amount of SOL will be used for the transaction fee
          </p>
          <p className="text-blue-600">
            • Transaction requires {amount} DSAT token from your wallet
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onError && onError(new Error('User canceled'))}
            disabled={isLoading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-1/2 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handlePurchase}
            disabled={isLoading || !connected || !publicKey || !signTransaction}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-1/2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}; 