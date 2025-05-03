"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/user";
import { toast } from "react-toastify";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DashboardSection from '@/components/features/Dashboard/DashboardSection';
import { UserStats } from '@/types/user';
import { BsStar, BsCalendar4Week, BsClockHistory, BsGem } from 'react-icons/bs';
import { ActivePowerup } from '@/types/store';
import { formatTime } from '@/lib/utils';

// Dynamically import the PhantomWalletConnector to prevent server-side rendering issues
const PhantomWalletConnector = dynamic(
  () => import('@/components/features/Wallet/PhantomWalletConnector'),
  { ssr: false } // This ensures the component only loads on the client side
);

const DashboardCrypto = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [greeting, setGreeting] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    signature?: string;
    transactionId?: string;
    tokenAmount?: number;
    solanaExplorerUrl?: string;
    tokenMint?: string;
    tokenAccount?: string;
  } | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    setTimeout(() => {
      handleGetUser();
    }, 1000); // 1 second
  }, [setUser]);

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return "Good morning";
      if (hours < 18) return "Good afternoon";
      return "Good evening";
    };

    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        const [statsResponse, powerupsResponse] = await Promise.all([
          axios.get(`/api/stats?userId=${user._id}`),
          axios.get(`/api/shop/active-powerups?userId=${user._id}`)
        ]);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        }

        if (powerupsResponse.data.success) {
          setActivePowerups(powerupsResponse.data.activePowerups);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  // Update timer countdown every second for active powerups
  useEffect(() => {
    if (activePowerups.length === 0) return;

    const interval = setInterval(() => {
      setActivePowerups(prevPowerups => {
        // Update remaining time based on current time and expiration
        const updatedPowerups = prevPowerups.map(powerup => ({
          ...powerup,
          remainingTime: Math.max(0, new Date(powerup.activeUntil).getTime() - Date.now())
        }));
        
        // Filter out expired powerups
        return updatedPowerups.filter(p => p.remainingTime > 0);
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activePowerups.length]);

  const handleTransfer = async () => {
    if (!walletAddress) {
      toast.error("Please enter your Phantom wallet address");
      return;
    }

    if (!transferAmount || isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      toast.error("Please enter a valid amount to transfer");
      return;
    }

    const amount = Number(transferAmount);
    
    if (user?.currency !== undefined && amount > user.currency) {
      toast.error(`You don't have enough DailySAT coins. Current balance: ${user.currency}`);
      return;
    }

    setIsTransferring(true);
    setLastTransaction(null);

    try {
      // Call API to update user's currency and store wallet info
      const response = await axios.post("/api/wallet/transfer", {
        amount,
        walletAddress,
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
        
        // Store transaction details
        setLastTransaction({
          signature: response.data.signature,
          tokenAmount: response.data.tokenAmount,
          solanaExplorerUrl: response.data.solanaExplorerUrl,
          tokenMint: response.data.tokenMint,
          tokenAccount: response.data.tokenAccount
        });
        
        toast.success(`Successfully transferred ${amount} DailySAT coins to your wallet!`);
        setTransferAmount("");
      } else {
        toast.error(response.data.message || "Transfer failed");
      }
    } catch (error: unknown) {
      console.error("Transfer error:", error);
      let errorMessage = "An error occurred during the transfer";
      
      if (axios.isAxiosError(error) && error.response) {
        // Use the server's error message if available
        errorMessage = error.response.data?.message || errorMessage;
        
        // Special handling for Solana rate limiting
        if (error.response.status === 503 || 
            (error.response.data?.message && error.response.data.message.includes("Solana network"))) {
          toast.error(errorMessage);
          toast.info("The Solana Devnet faucet has reached its limit. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsTransferring(false);
    }
  };

  const statsData = [
    { title: 'Current Streak', value: stats?.currentStreak || 0, icon: <BsStar className="text-yellow-500" /> },
    { title: 'Longest Streak', value: stats?.longestStreak || 0, icon: <BsCalendar4Week className="text-green-500" /> },
    { title: 'Total Correct', value: stats?.totalCorrect || 0, icon: <BsClockHistory className="text-blue-500" /> },
    { title: 'Total Coins', value: user?.currency || 0, icon: <BsGem className="text-purple-500" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 md:p-8 shadow-lg mb-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to DailySAT!</h1>
            <p className="text-purple-200">Your daily SAT study companion</p>
            
            <div className="mt-6 flex gap-4">
              <Link href="/auth/signin" className="bg-white text-purple-700 px-6 py-3 rounded-lg transition-colors hover:bg-gray-100">
                Sign In
              </Link>
              <Link href="/" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg transition-colors hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 md:p-8 shadow-lg mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user.username || 'Scholar'}!
          </h1>
          <p className="text-purple-200">Manage your DailySAT crypto tokens</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {statsData.map((stat, idx) => (
              <div key={idx} className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {stat.icon}
                  <span className="ml-2 text-sm">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Connection Section */}
            <DashboardSection title="Phantom Wallet Connection" icon="👛">
              <PhantomWalletConnector />
            </DashboardSection>

            {/* Manual Transfer Section */}
            <DashboardSection title="Manual Token Transfer" icon="💸">
              <div className="bg-white p-5 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Phantom Wallet Address</label>
                    <input
                      type="text"
                      placeholder="Enter Phantom wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Amount to Transfer</label>
                    <div className="flex">
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                      <button
                        onClick={handleTransfer}
                        disabled={isTransferring}
                        className={`bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 ${
                          isTransferring ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isTransferring ? "Transferring..." : "Transfer"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {user?.currency || 0} DailySAT coins
                    </p>
                  </div>

                  {lastTransaction && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="text-green-800 font-semibold mb-2">Transaction Successful!</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Token Amount:</span>
                          <span className="text-sm font-medium ml-2">{lastTransaction.tokenAmount} DSAT</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Transaction:</span>
                          <a
                            href={lastTransaction.solanaExplorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium ml-2 text-blue-600 hover:text-blue-800"
                          >
                            View on Solana Explorer
                          </a>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Token Account:</span>
                          <span className="text-sm font-mono block mt-1 break-all bg-gray-100 p-1 rounded">
                            {lastTransaction.tokenAccount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>

            {/* Instructions Section */}
            <DashboardSection title="Solana Token Instructions" icon="📝">
              <div className="bg-white p-5 rounded-lg">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                    <p className="text-sm text-yellow-700">
                      DailySAT tokens are running on Solana Devnet, which is for testing purposes only.
                      These tokens have no real-world value. Use them to experiment with the platform features.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">How to View Tokens in Phantom Wallet</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Open your Phantom wallet browser extension</li>
                      <li>Go to Settings → Developer Settings</li>
                      <li>Change Network to &quot;Devnet&quot;</li>
                      <li>Return to main wallet view</li>
                      <li>Your DailySAT tokens should appear automatically</li>
                      <li>If not, click &quot;Manage Token List&quot; and add custom token</li>
                      <li>Enter the DailySAT token mint address (available in transaction details)</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      <li>If tokens don&apos;t appear, make sure you&apos;re on the Devnet network in Phantom</li>
                      <li>Transfer failures may occur if the Solana Devnet is congested</li>
                      <li>Wait a few minutes and try again if transfers fail</li>
                    </ul>
                  </div>
                </div>
              </div>
            </DashboardSection>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Active Powerups Section */}
            <DashboardSection title="Active Powerups" icon="✨">
              {activePowerups.length > 0 ? (
                <div className="space-y-3">
                  {activePowerups.map((powerup, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 shadow border border-yellow-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-amber-800">{powerup.itemName || 'Powerup'}</h3>
                          <p className="text-sm text-amber-700">
                            {powerup.itemType === 'multiplier' 
                              ? `${powerup.itemValue}x boost` 
                              : powerup.itemDescription || 'Enhances your learning experience'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-amber-800">Time Left</div>
                          <div className="text-xl font-mono text-amber-900">
                            {formatTime(Math.floor((powerup.remainingTime || 
                              Math.max(0, new Date(powerup.activeUntil).getTime() - Date.now())
                            ) / 1000))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-4">You don&apos;t have any active powerups</p>
                  <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
                    Visit Shop
                  </Link>
                </div>
              )}
            </DashboardSection>

            {/* Quick Links Section */}
            <DashboardSection title="Navigation" icon="🧭">
              <div className="grid grid-cols-1 gap-3">
                <Link href="/dashboard" 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg p-3 transition-colors flex items-center justify-between">
                  <span className="font-medium">Main Dashboard</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/shop" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg p-3 transition-colors flex items-center justify-between">
                  <span className="font-medium">Shop</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/math" 
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg p-3 transition-colors flex items-center justify-between">
                  <span className="font-medium">Math Practice</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/reading-writing" 
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg p-3 transition-colors flex items-center justify-between">
                  <span className="font-medium">Reading & Writing</span>
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </DashboardSection>

            {/* Account Information */}
            <DashboardSection title="Account Information" icon="👤">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Username</label>
                    <div className="font-medium">{user.username}</div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Wallet</label>
                    <div className="font-medium break-all">
                      {user.phantomWallet ? (
                        <span className="font-mono text-sm">{user.phantomWallet}</span>
                      ) : (
                        <span className="text-gray-500 italic">Not connected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Email</label>
                    <div className="font-medium">{user.email || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </DashboardSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCrypto; 