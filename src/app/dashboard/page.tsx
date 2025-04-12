"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import StatDisplay from "@/components/features/Dashboard/StatDisplay";
import axios from "axios";
import Quotes from "@/types/dashboard/quotes";
import Spinner from "@/components/common/Spinner";
import { useUserStore } from "@/store/user";
import { quotes } from "@/data/quotes";
import Image from "next/image";
import BookSVG from "../../components/features/Questions/icons/BookSVG";
import MathSVG from "../../components/features/Questions/icons/BookSVG";
import Option from "../../components/features/Dashboard/Option";

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
    setTimeout(() => {
      handleGetUser();
    }, 1000); // 100 seconds
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
  if (loading) return <Spinner />;

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
        {user != null ? (
          <h1 className="text-xl md:text-4xl font-bold text-gray-800">
            {greeting
              ? `${greeting}, ${user?.name || "User"}`
              : "Loading greeting..."}
          </h1>
        ) : (
          <Skeleton className="md:w-[400px] w-[250px] md:h-[40px] h-[28px] rounded-full bg-black/60" />
        )}
        {user != null ? (
          <p className="text-xs md:text-base text-gray-600 font-light">
            Choose what to study and start practicing...
          </p>
        ) : (
          <Skeleton className="md:w-[313px] h-[16px] w-[225px] md:h-[24px] mt-1 rounded-full bg-gray-400" />
        )}
      </div>

      <div className="flex items-center justify-center pl-5 mt-10">
        {user != null ? (
          <h1 className="pl-3.5 font-bold text-4xl text-blue-900">Practice!</h1>
        ) : (
          <Skeleton className="w-[140px] h-[40px] mb-1 rounded-full bg-blue-900" />
        )}
      </div>
      <div className="lg:px-16 lg:p-6 px-2">
        <div className="grid grids-cols-1 md:grid-cols-2 mx-auto md:w-4/5 gap-2 mt-px">
          {user != null ? (
            <Option
              icon={<BookSVG />}
              header="Reading & Writing"
              redirect="/reading-writing"
            />
          ) : (
            <Skeleton className="w-full h-[64px] bg-gray-700/60" />
          )}
          {user != null ? (
            <Option icon={<MathSVG />} header="Math" redirect="/math" />
          ) : (
            <Skeleton className="w-full h-[64px] bg-gray-700/60" />
          )}
        </div>
      </div>

      {/* Stats Header */}
      <div className="flex items-center pl-5 mt-10">
        {user != null ? (
          <h1 className="pl-3.5 font-bold text-4xl text-blue-900">Stats</h1>
        ) : (
          <Skeleton className="w-[100px] ml-2 h-[40px] rounded-full bg-blue-900" />
        )}
      </div>

      {/* User Stats */}
      <div className="lg:flex lg:space-x-2 mt-1.5 p-3.5">
        <div className="shadow-lg rounded-lg w-full bg-white p-4 flex lg:items-center flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center mb-3">
            {user != null ? (
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
            ) : (
              <Skeleton className="w-[120px] h-[120px] rounded-2xl bg-gray-400" />
            )}
            <div className="ml-6">
              {user == null ? (
                <Skeleton className="w-[200px] h-[35px] rounded-full bg-blue-600" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">{user.name}</p>
              )}
              {user != null ? (
                <p>Email: {user?.email}</p>
              ) : (
                <Skeleton className="w-[200px] h-[24px]  mt-4 rounded-full bg-gray-400" />
              )}
            </div>
          </div>

          <div className="lg:mr-[10vw] relative">
            {user != null ? (
              <p className="text-xl font-semibold text-green-600">
                Referral Code
              </p>
            ) : (
              <Skeleton className="w-[150px] h-[28px] bg-green-600/80 rounded-full" />
            )}
            {user != null ? (
              <>
                <p className="text-gray-700 flex items-center   ">
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
              </>
            ) : (
              <Skeleton className="w-[200px] h-[24px] mt-4 rounded-full bg-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Stat Display */}
      <div className="lg:flex lg:space-x-2 mt-1.5 p-3.5">
        {user != null ? (
          <StatDisplay
            type="coins"
            color="black"
            icon="coin"
            header="DailySAT Coins:"
            number={user?.currency ?? 0}
            status="upward"
            percentage={(user?.currency ?? 0) * 100}
          />
        ) : (
          <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60 " />
        )}
        {user != null ? (
          <StatDisplay
            type="attempts"
            color="green"
            icon="checked"
            header="Answered Correctly:"
            number={user?.correctAnswered ?? 0}
            status="upward"
            percentage={(user?.correctAnswered ?? 0) * 100}
          />
        ) : (
          <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60 " />
        )}
        {user != null ? (
          <StatDisplay
            type="attempts"
            color="#ff5454"
            icon="cross"
            header="Answered Wrongly:"
            number={user?.wrongAnswered ?? 0}
            status="upward"
            percentage={(user?.wrongAnswered ?? 0) * 100}
          />
        ) : (
          <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60 " />
        )}
      </div>

      {/* Quote Section */}
      <div className="mt-4 flex flex-col md:flex-row p-3.5 w-full space-y-3 md:space-y-0 md:space-x-3">
        {user != null ? (
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
        ) : (
          <Skeleton className="md:w-1/3 w-full h-[116px] bg-gray-600/60 " />
        )}
      </div>
    </div>
  );
};

export default Home;
