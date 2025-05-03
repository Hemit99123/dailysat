'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user';
import { toast } from 'react-toastify';
import axios from 'axios';

type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

interface PhantomProvider {
  isPhantom?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: () => void) => void;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
}

const getProvider = (): PhantomProvider | undefined => {
  if (typeof window !== 'undefined') {
    const windowObj = window as Window & { 
      phantom?: {
        solana?: PhantomProvider 
      }
    };
    const provider = windowObj.phantom?.solana;
    
    // Check if phantom wallet is installed
    if (provider?.isPhantom) {
      return provider;
    }
  }
  
  return undefined;
};

export default function PhantomWalletConnector() {
  const [phantomInstalled, setPhantomInstalled] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  
  // Check if Phantom is installed and if user is already connected
  useEffect(() => {
    const provider = getProvider();
    setPhantomInstalled(provider !== undefined);
    
    if (provider) {
      // Set connected if provider has a public key (is connected)
      setConnected(provider.isConnected && provider.publicKey !== null);
      if (provider.publicKey) {
        setPublicKey(provider.publicKey.toString());
      }
      
      // Add event listeners
      provider.on('connect', () => {
        setConnected(true);
        if (provider.publicKey) {
          setPublicKey(provider.publicKey.toString());
        }
      });
      
      provider.on('disconnect', () => {
        setConnected(false);
        setPublicKey('');
      });
      
      provider.on('accountChanged', () => {
        if (provider.publicKey) {
          setPublicKey(provider.publicKey.toString());
        } else {
          setConnected(false);
          setPublicKey('');
        }
      });
    }
  }, []);
  
  // Update UI when user wallet address changes
  useEffect(() => {
    if (user?.phantomWallet !== publicKey && user?._id && publicKey && connected) {
      updateUserWallet();
    }
  }, [publicKey, connected, user?._id]);
  
  const connectWallet = async () => {
    try {
      const provider = getProvider();
      
      if (!provider) {
        toast.error('Phantom wallet is not installed!');
        return;
      }
      
      setIsConnecting(true);
      const response = await provider.connect();
      const walletPublicKey = response.publicKey.toString();
      
      setConnected(true);
      setPublicKey(walletPublicKey);
      
      // Update user with wallet address
      if (user?._id) {
        updateUserWallet(walletPublicKey);
      }
      
      toast.success('Phantom wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      toast.error('Failed to connect to Phantom wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      
      if (!provider) {
        return;
      }
      
      await provider.disconnect();
      setConnected(false);
      setPublicKey('');
      
      // Remove wallet address from user
      if (user?._id) {
        updateUserWallet('');
      }
      
      toast.info('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  const updateUserWallet = async (walletAddress?: string) => {
    if (!user?._id) return;
    
    try {
      setIsUpdating(true);
      const addressToUpdate = walletAddress !== undefined ? walletAddress : publicKey;
      const response = await axios.post('/api/wallet/update', {
        userId: user._id,
        walletAddress: addressToUpdate
      });
      
      if (response.data.success) {
        // Update user state with new wallet address
        setUser({
          ...user,
          phantomWallet: addressToUpdate
        });
      }
    } catch (error) {
      console.error('Error updating user wallet:', error);
      toast.error('Failed to save wallet address');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const installWallet = () => {
    window.open('https://phantom.app/', '_blank');
  };
  
  // Already connected through the saved wallet in user profile
  const isAlreadyConnected = user?.phantomWallet && user.phantomWallet === publicKey;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <img 
            src="/images/phantom-icon.png" 
            alt="Phantom Wallet" 
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.src = "https://phantom.app/favicon.ico";
            }}
          />
        </div>
        <h3 className="text-lg font-bold">Phantom Wallet</h3>
      </div>
      
      {!phantomInstalled ? (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Phantom wallet is not installed. Install it to buy powerups with DailySAT Tokens.
          </p>
          <button
            onClick={installWallet}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Install Phantom
          </button>
        </div>
      ) : !connected ? (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Connect your Phantom wallet to buy powerups with DailySAT Tokens.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors ${
              isConnecting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-mono text-sm truncate max-w-xs">
                {publicKey}
              </p>
            </div>
            {isUpdating && <div className="spinner-small"></div>}
          </div>
          
          {isAlreadyConnected ? (
            <div className="bg-green-50 p-2 rounded-md text-green-700 text-sm mb-3">
              ✓ This wallet is connected to your account
            </div>
          ) : (
            <div className="bg-yellow-50 p-2 rounded-md text-yellow-700 text-sm mb-3">
              ⚠️ Update your profile to use this wallet
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={() => updateUserWallet()}
              disabled={isUpdating || isAlreadyConnected}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors ${
                (isUpdating || isAlreadyConnected) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUpdating ? 'Saving...' : isAlreadyConnected ? 'Saved' : 'Save Wallet'}
            </button>
            
            <button
              onClick={disconnectWallet}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 