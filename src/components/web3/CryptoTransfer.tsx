import React, { useState } from 'react';
import { useUserStore } from '@/store/user';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Type definitions for dynamic imports
interface WalletAdapter {
  publicKey: { toString: () => string } | null;
  connected: boolean;
}

// We'll try to import the Solana dependencies but provide fallbacks if not available
let useWallet: () => WalletAdapter;
let WalletMultiButton: React.ComponentType<{ className: string }>;

try {
  // Dynamic imports for Web3 components - using dynamic import() to avoid require()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const walletAdapter = require('@solana/wallet-adapter-react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const walletAdapterUI = require('@solana/wallet-adapter-react-ui');
  
  useWallet = walletAdapter.useWallet;
  WalletMultiButton = walletAdapterUI.WalletMultiButton;
} catch (error) {
  console.error('Solana wallet adapter dependencies not available:', error);
  // Create placeholders for the Web3 components
  useWallet = () => ({ publicKey: null, connected: false });
  WalletMultiButton = (props: { className: string }) => (
    <button className={`bg-gray-200 px-4 py-2 rounded ${props.className}`}>
      Connect Wallet (Not Available)
    </button>
  );
  WalletMultiButton.displayName = 'WalletMultiButtonFallback';
}

const CryptoTransfer: React.FC = () => {
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Try to use the wallet hook, but provide fallback values if not available
  let publicKey: { toString: () => string } | null = null;
  let connected = false;
  
  try {
    const wallet = useWallet();
    publicKey = wallet.publicKey;
    connected = wallet.connected;
  } catch (error) {
    // We already initialized default values
    setError('Phantom wallet integration not available. Please make sure all dependencies are installed.');
  }
  
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleTransfer = async () => {
    if (!connected) {
      toast.error('Please connect your Phantom wallet first');
      return;
    }

    if (!transferAmount || isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      toast.error('Please enter a valid amount to transfer');
      return;
    }

    const amount = Number(transferAmount);
    
    if (user?.currency !== undefined && amount > user.currency) {
      toast.error(`You don't have enough DailySAT coins. Current balance: ${user.currency}`);
      return;
    }

    setIsTransferring(true);

    try {
      // Call API to update user's currency and store wallet info
      const response = await axios.post('/api/wallet/transfer', {
        amount,
        walletAddress: publicKey?.toString(),
        userId: user?._id
      });

      if (response.data.success) {
        // Update local user state with new currency amount
        if (user) {
          setUser({
            ...user,
            currency: user.currency - amount
          });
        }
        
        toast.success(`Successfully transferred ${amount} DailySAT coins to your wallet!`);
        setTransferAmount('');
      } else {
        toast.error(response.data.message || 'Transfer failed');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{message?: string}>;
        toast.error(axiosError.response?.data?.message || 'An error occurred during the transfer');
      } else {
        toast.error('An error occurred during the transfer');
      }
    } finally {
      setIsTransferring(false);
    }
  };

  // If there's an error with the wallet dependencies, show an error message
  if (error) {
    return (
      <div className="shadow-lg rounded-lg w-full bg-white p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <h2 className="text-xl font-bold text-gray-700 ml-2">Transfer to Phantom Wallet</h2>
        </div>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-lg rounded-lg w-full bg-white p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xl">💰</span>
        </div>
        <h2 className="text-xl font-bold text-gray-700 ml-2">Transfer to Phantom Wallet</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Connect your Phantom wallet:</p>
          <WalletMultiButton className="wallet-adapter-button" />
        </div>
        
        {connected && (
          <>
            <div>
              <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
              <p className="text-xs md:text-sm font-mono bg-gray-100 p-2 rounded-md break-all">
                {publicKey?.toString()}
              </p>
            </div>

            <div>
              <label htmlFor="transferAmount" className="text-sm text-gray-600 mb-2 block">
                Amount to Transfer:
              </label>
              <div className="flex items-center">
                <input
                  id="transferAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="border rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max={user?.currency?.toString() || '0'}
                  disabled={isTransferring}
                />
                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || !transferAmount}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors ${
                    isTransferring || !transferAmount ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isTransferring ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: {user?.currency || 0} DailySAT coins
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Add display name
CryptoTransfer.displayName = 'CryptoTransfer';

export default CryptoTransfer; 