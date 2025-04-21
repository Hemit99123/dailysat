"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/user";
import Link from 'next/link';
import Image from "next/image";
import { toast } from "react-toastify";
import DashboardSection from '@/components/features/Dashboard/DashboardSection';
import { UserStats } from '@/types/user';
import { BsStar, BsCalendar4Week, BsClockHistory, BsGem } from 'react-icons/bs';
import { ActivePowerup } from '@/types/store';
import { formatTime } from '@/lib/utils';
import InventoryList from '@/components/features/Powerups/PowerupInventory';
import { Copy } from 'lucide-react';

// Define interface for recently answered questions
interface RecentQuestion {
  _id: string;
  question: string;
  isCorrect?: boolean;
  answeredAt?: string;
}

const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  
  const [imageError, setImageError] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePowerups, setActivePowerups] = useState<ActivePowerup[]>([]);
  const [recentlyAnswered, setRecentlyAnswered] = useState<RecentQuestion[]>([]);
  const [isAddingCoins, setIsAddingCoins] = useState(false);

  // Function to refresh all user data
  const refreshUserData = async () => {
    setIsRefreshing(true);
    try {
      // Get fresh user data
      const userResponse = await axios.get("/api/auth/get-user");
      if (userResponse.data.user) {
        setUser?.(userResponse.data.user);
        console.log("User data refreshed successfully");
      }
      
      // Only proceed with dashboard data if we have a user
      if (!userResponse.data?.user?._id) {
        setIsRefreshing(false);
        return;
      }
      
      const userId = userResponse.data.user._id;
      
      // Get all dashboard data in parallel
      const [statsResponse, recentlyAnsweredResponse, powerupsResponse] = await Promise.all([
        axios.get(`/api/stats?userId=${userId}`),
        axios.get(`/api/questions/recently-answered?userId=${userId}&limit=3`),
        axios.get(`/api/shop/active-powerups?userId=${userId}`)
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (recentlyAnsweredResponse.data.success) {
        setRecentlyAnswered(recentlyAnsweredResponse.data.recentlyAnswered || []);
      }

      if (powerupsResponse.data.success) {
        // Calculate initial remaining time when fetching
        const now = Date.now();
        const processedPowerups = (powerupsResponse.data.activePowerups || []).map(p => ({
          ...p,
          remainingTime: Math.max(0, (new Date(p.activeUntil).getTime() - now) / 1000) // seconds
        }));
        setActivePowerups(processedPowerups);
      } else {
        setActivePowerups([]);
      }
      
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh dashboard data");
      setActivePowerups([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load of user data
  useEffect(() => {
    refreshUserData();
    
    // Set greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    // Load is complete when user data is fetched
    setIsLoading(false);
  }, []);

  // Refresh on route change or focus
  useEffect(() => {
    // Refresh when the window gets focus
    const handleFocus = () => {
      console.log("Window focused, refreshing data");
      refreshUserData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Client-side timer countdown logic for ACTIVE powerups
  useEffect(() => {
    // Check if there are any powerups that need counting down
    const needsTimer = activePowerups.some((p: ActivePowerup) => p.isActive && p.remainingTime > 0);

    if (!needsTimer) {
      // No active powerups needing countdown, ensure no interval is running
      return; 
    }
    
    console.log("[Timer Effect] Setting up interval.");

    const interval = setInterval(() => {
      // Use functional update to safely access previous state
      setActivePowerups(prevPowerups => {
        let hasChanged = false;
        const nextPowerups = prevPowerups.map(p => {
          // Only decrement active powerups with time remaining
          if (p.isActive && p.remainingTime > 0) {
            hasChanged = true;
            return { ...p, remainingTime: p.remainingTime - 1 };
          }
          return p;
        });

        // Only return a new array if something actually changed
        // And filter out any powerups that just hit 0
        return hasChanged 
          ? nextPowerups.filter(p => !p.isActive || p.remainingTime > 0) 
          : prevPowerups;
      });
    }, 1000); // Update every second

    // Cleanup function to clear the interval
    return () => {
      console.log("[Timer Effect] Cleaning up interval.");
      clearInterval(interval);
    };
    
  }, [activePowerups.some(p => p.isActive && p.remainingTime > 0)]); // Re-run ONLY if the condition (needsTimer) changes

  const handleCopyReferral = async () => {
    if (!user?._id) return;
    
    const referralCode = user._id;
    await navigator.clipboard.writeText(referralCode);
    toast.success("Referral ID copied to clipboard!");
  };

  const toggleImageError = () => {
    setImageError((prevState) => !prevState);
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
          {/* Header */}
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

          <div className="grid grid-cols-1 gap-8">
            {/* Featured content */}
            <DashboardSection title="Get Started with DailySAT" icon="🚀">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-2 text-blue-600">Practice Questions</h3>
                  <p className="text-gray-600 mb-4">Access hundreds of SAT practice questions with detailed explanations.</p>
                  <div className="flex space-x-4">
                    <Link href="/math" className="text-blue-600 hover:text-blue-800 font-medium">
                      Math
                    </Link>
                    <Link href="/reading-writing" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Reading & Writing
                    </Link>
                  </div>
      </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-2 text-purple-600">Shop Powerups</h3>
                  <p className="text-gray-600 mb-4">Boost your study sessions with multipliers and special features.</p>
                  <Link href="/shop" className="text-purple-600 hover:text-purple-800 font-medium">
                    Visit Shop
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-2 text-amber-600">Join Now</h3>
                  <p className="text-gray-600 mb-4">Create an account to track your progress and earn rewards.</p>
                  <Link href="/auth/signin" className="text-amber-600 hover:text-amber-800 font-medium">
                    Sign Up
                  </Link>
                </div>
              </div>
            </DashboardSection>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.image && !imageError ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
              <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                onError={toggleImageError}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {greeting}, {user.username || 'Scholar'}!
                </h1>
                <p className="text-purple-200">Track your progress and manage your DailySAT account</p>
              </div>
            </div>
            
            <button 
              onClick={refreshUserData} 
              disabled={isRefreshing}
              className="flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors rounded-full w-10 h-10"
              title="Refresh dashboard data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

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
            {/* Active Powerups Section (Displays currently active ones) */}
            <DashboardSection title="Active Powerups" icon="✨">
              {activePowerups && activePowerups.filter(p => p.isActive).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePowerups.filter(p => p.isActive).map((powerup, idx) => (
                    <div
                      key={idx} 
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 shadow border border-yellow-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-amber-800">{powerup.itemName || powerup.name}</h3>
                          <p className="text-sm text-amber-700">
                            {powerup.itemType === 'multiplier' || powerup.type === 'multiplier' 
                              ? `${powerup.itemValue || powerup.value}x boost` 
                              : powerup.itemDescription || 'Enhances your learning experience'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-amber-800">Time Left</div>
                          <div className="text-xl font-mono text-amber-900">
                            {formatTime(Math.floor(powerup.remainingTime || 0))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">No active powerups</p>
                </div>
              )}
            </DashboardSection>

            {/* Powerup Inventory Section */}
            <DashboardSection title="Powerup Inventory" icon="🎒">
               <InventoryList />
            </DashboardSection>

            {/* Recently Answered Questions */}
            <DashboardSection title="Recently Answered Questions" icon="📝">
              <div className="space-y-3">
                {recentlyAnswered.length > 0 ? (
                  recentlyAnswered.map((question) => (
                    <div 
                      key={question._id} 
                      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                        question.isCorrect 
                          ? 'border-green-500' 
                          : 'border-red-500'
                      }`}
                    >
                      <div className="flex justify-between">
                        <p>
                          {question.question}
                        </p>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          question.isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {question.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      {question.answeredAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(question.answeredAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">You haven&apos;t answered any questions yet</p>
                    <div className="flex justify-center space-x-4">
                      <Link href="/math" className="text-blue-600 hover:text-blue-800 font-medium">
                        Practice Math
                      </Link>
                      <Link href="/reading-writing" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Practice Reading & Writing
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </DashboardSection>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <DashboardSection title="Quick Actions" icon="⚡️">
              <div className="grid grid-cols-1 gap-4">
                <Link href="/math" 
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-5 shadow-md hover:from-blue-600 hover:to-blue-800 transition-colors flex items-center justify-between">
                  <span className="font-bold">Math Practice</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/reading-writing" 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg p-5 shadow-md hover:from-indigo-600 hover:to-indigo-800 transition-colors flex items-center justify-between">
                  <span className="font-bold">Reading & Writing</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/shop" 
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg p-5 shadow-md hover:from-purple-600 hover:to-purple-800 transition-colors flex items-center justify-between">
                  <span className="font-bold">Visit Shop</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link href="/ai" 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-lg p-5 shadow-md hover:from-emerald-600 hover:to-emerald-800 transition-colors flex items-center justify-between">
                  <span className="font-bold">Study with AI</span>
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
                    <label className="block text-gray-600 text-sm mb-1">Member Since</label>
                    <div className="font-medium">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString() 
                        : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Email</label>
                    <div className="font-medium">{user.email || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Referral ID</label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono block truncate mr-2 flex-grow">
                        {user._id}
                      </code>
                      <button 
                        onClick={handleCopyReferral} 
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full transition-colors flex items-center"
                      >
                        <Copy size={14} className="mr-1.5" />
                        Copy ID
                      </button>
                    </div>
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

export default Home;
