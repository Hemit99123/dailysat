import { FC, ReactNode, useMemo, useState } from 'react';

// Define types for the dynamic imports
interface ConnectionProviderProps {
  endpoint: string;
  children: ReactNode;
}

interface WalletProviderProps {
  wallets: any[];
  autoConnect: boolean;
  children: ReactNode;
}

interface WalletModalProviderProps {
  children: ReactNode;
}

interface WalletContextProviderProps {
  children: ReactNode;
}

// Create placeholder components in case the actual components can't be loaded
const FallbackProvider: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
FallbackProvider.displayName = 'FallbackProvider';

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  
  let ConnectionProvider: FC<ConnectionProviderProps>;
  let WalletProvider: FC<WalletProviderProps>;
  let WalletModalProvider: FC<WalletModalProviderProps>;
  let clusterApiUrl: (network: string) => string;
  let WalletAdapterNetwork: { Devnet: string };
  let PhantomWalletAdapter: new () => any;
  
  try {
    // Dynamic imports with proper error handling
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const walletAdapterReact = require('@solana/wallet-adapter-react');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const walletAdapterReactUI = require('@solana/wallet-adapter-react-ui');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const web3js = require('@solana/web3.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const walletAdapterBase = require('@solana/wallet-adapter-base');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const phantomAdapter = require('@solana/wallet-adapter-phantom');
    
    ConnectionProvider = walletAdapterReact.ConnectionProvider;
    WalletProvider = walletAdapterReact.WalletProvider;
    WalletModalProvider = walletAdapterReactUI.WalletModalProvider;
    clusterApiUrl = web3js.clusterApiUrl;
    WalletAdapterNetwork = walletAdapterBase.WalletAdapterNetwork;
    PhantomWalletAdapter = phantomAdapter.PhantomWalletAdapter;
    
    // Import the styles if available
    try {
      require('@solana/wallet-adapter-react-ui/styles.css');
    } catch (styleError) {
      console.warn('Wallet adapter styles not available:', styleError);
    }
  } catch (importError) {
    console.error('Error loading wallet adapter dependencies:', importError);
    setError('Failed to load Phantom wallet integration. Please make sure all dependencies are installed.');
    
    // Use fallback components
    ConnectionProvider = FallbackProvider;
    WalletProvider = FallbackProvider;
    WalletModalProvider = FallbackProvider;
    clusterApiUrl = () => '';
    WalletAdapterNetwork = { Devnet: 'devnet' };
    PhantomWalletAdapter = class MockAdapter { };
  }
  
  // If there was an error loading dependencies, just render the children without the wallet context
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Wallet Integration Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // so that only the wallets you configure are bundled
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

WalletContextProvider.displayName = 'WalletContextProvider'; 