'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { ReactNode, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';

// Import the required CSS for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize wallet adapters with proper error handling
  const wallets = useMemo(
    () => [
      // Add more wallet adapters here as needed
      new PhantomWalletAdapter(),
    ],
    []
  );

  // Define wallet error handler
  const onError = useCallback(
    (error: Error) => {
      console.error('Wallet error:', error);
      toast.error(`Wallet error: ${error.message}`);
    },
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        onError={onError}
        autoConnect={false}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}; 