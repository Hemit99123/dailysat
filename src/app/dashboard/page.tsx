"use client";

import { useEffect, useState } from "react";
import StatDisplay from "@/components/features/Dashboard/StatDisplay";
import axios from "axios";
import Quotes from "@/types/dashboard/quotes";
import Spinner from "@/components/common/Spinner";
import { useUserStore } from "@/store/user";
import ExploreSectionFeats from "@/components/features/Dashboard/ExploreSectionFeats";
import { quotes } from "@/data/quotes";
import Image from "next/image";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState<Quotes | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleFetchQuote = async () => {
      setIsLoadingQuote(true);
      try {
        const quotesLength = quotes?.length || 0;
        const randomIndex = Math.floor(Math.random() * quotesLength);
        setQuote(quotes?.[randomIndex] || null);
      } catch (error) {
        console.error("Error fetching quote:", error);
        alert("Something went wrong while retrieving your quote.");
      } finally {
        setIsLoadingQuote(false);
      }
    };
    const handleGetUser = async () => {
      let response = null;
      try {
        response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user);
        if (response?.data?.result === "Success - using cache") {
          setCached(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleFetchQuote();
    handleGetUser();
  }, [setUser]);

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return "Good morning";
      if (hours < 18) return "Good afternoon";
      return "Good evening";
    };

    setGreeting(getGreeting());
    setLoading(false);
  }, []);

  const handleCopyReferral = async () => {
    const referralCode = user?._id ?? "";
    await navigator.clipboard.writeText(referralCode);
  };

  const toggleImageError = () => {
    setImageError((prevState) => !prevState);
  };

  if (loading || user == null) return <Spinner />;

  return (
    <div>
      {/* Greeting Section */}
      <div className="flex flex-col items-center mt-8">
        {cached && (
          <div className="flex items-center text-[12px] space-x-2 text-gray-600 font-medium">
            {/* Cached warning SVG omitted for brevity */}
            <p>Old data because you reached your limit</p>
          </div>
        )}

        <h1 className="text-xl md:text-4xl font-bold text-gray-800">
          {greeting
            ? `${greeting}, ${user?.name || "User"}`
            : "Loading greeting..."}
        </h1>
        <p className="text-xs md:text-base text-gray-600 font-light">
          Choose what to study and start practicing...
        </p>
      </div>

      <ExploreSectionFeats />

      {/* Stats Header */}
      <div className="flex items-center pl-5 mt-10">
        <h1 className="pl-3.5 font-bold text-4xl text-blue-900">Stats</h1>
      </div>

      {/* User Stats */}
      <div className="lg:flex lg:space-x-2 mt-1.5 p-3.5">
        <div className="shadow-lg rounded-lg w-full bg-white p-4 flex lg:items-center flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center mb-3">
            <Image
              src={
                (!imageError && user?.image) ||
                "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg"
              }
              alt="userpfpic"
              width={120}
              height={120}
              onError={toggleImageError}
              className="rounded-2xl"
            />
            <div className="ml-6">
              <p className="text-3xl font-bold text-blue-600">
                {user?.name || "Unnamed User"}
              </p>
              <p>Email: {user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="lg:mr-[10vw] relative">
            <p className="text-xl font-semibold text-green-600">
              Referral Code
            </p>
            <p className="text-gray-700 flex items-center -ml-2">
              <button onClick={handleCopyReferral}>
                <Image
                  src="/icons/copy.png"
                  className="w-10 h-10"
                  alt="Copy Referral Code"
                  width={100}
                  height={100}
                />
              </button>
              {user?._id || "Unavailable"}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Display */}
      <div className="lg:flex lg:space-x-2 mt-1.5 p-3.5">
        <StatDisplay
          type="coins"
          color="black"
          icon="coin"
          header="DailySAT Coins:"
          number={user?.currency ?? 0}
          status="upward"
          percentage={(user?.currency ?? 0) * 100}
        />
        <StatDisplay
          type="attempts"
          color="green"
          icon="checked"
          header="Answered Correctly:"
          number={user?.correctAnswered ?? 0}
          status="upward"
          percentage={(user?.correctAnswered ?? 0) * 100}
        />
        <StatDisplay
          type="attempts"
          color="#ff5454"
          icon="cross"
          header="Answered Wrongly:"
          number={user?.wrongAnswered ?? 0}
          status="upward"
          percentage={(user?.wrongAnswered ?? 0) * 100}
        />
      </div>

      {/* Quote Section */}
      <div className="mt-4 flex flex-col md:flex-row p-3.5 w-full space-y-3 md:space-y-0 md:space-x-3">
        <div className="w-full md:w-1/3 rounded-lg shadow-lg flex items-center justify-center">
          {isLoadingQuote ? (
            <Spinner />
          ) : quote ? (
            <div className="flex flex-col items-center text-center p-4">
              <p className="text-xl italic">“{quote.content}”</p>
              <p className="mt-2 text-sm text-gray-600">- {quote.author}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No quote available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
