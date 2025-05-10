"use client";

// Core React and UI Components
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import StatDisplay from "@/components/features/Dashboard/StatDisplay";
import Option from "../../components/features/Dashboard/Option";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Book, Calendar, EqualApproximately } from "lucide-react";
import { useUserStore } from "@/store/user";
import { ShopItem } from "@/types/shopitem";
import { User } from "@/types/user";
import { DisplayBanner } from "@/types/dashboard/banner";

const Home = () => {
  // Local State Management
  const [icon, setIcon] = useState("");
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [cached, setCached] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [imageError, setImageError] = useState(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [banner, setBanner] = useState<DisplayBanner>({
    style: "",
    content: "",
  });

  // Helper function to get user's highest value icon
  const getIcon = (userData: User) => {
    const icons = userData.itemsBought.filter((item: ShopItem) =>
      item.name.includes("Icon")
    );
    if (icons.length === 0) return;
    const mostExpensiveIcon = icons?.reduce((max: ShopItem, item: ShopItem) =>
      item.price > max.price ? item : max
    );
    console.log(mostExpensiveIcon.name.split(" ").join("-").toLowerCase());
    setIcon(mostExpensiveIcon.name.split(" ").join("-").toLowerCase());
  };

  // Helper function to get and set user's banner
  const getBanner = (userData: User) => {
    const banners = userData.itemsBought.filter((item: ShopItem) =>
      item.name.includes("Banner")
    );
    if (banners.length === 0) return;
    const mostExpensiveBanner = banners?.reduce(
      (max: ShopItem, item: ShopItem) => (item.price > max.price ? item : max)
    );
    const bannerMap: { [key: string]: DisplayBanner } = {
      diamondbanner: {
        style:
          "bg-[#00d3f2] p-4 flex items-center justify-center font-bold text-white shadow-lg   text-2xl border-[10px] text-center border-[#a2f4fd] h-[150px] w-full rounded-xl",
        content: `Congratulations on your Diamond Banner`,
      },
      emeraldbanner: {
        style:
          "bg-[#009966] p-4 flex items-center justify-center font-bold text-white shadow-lg   text-2xl border-[10px] text-center border-[#5ee9b5] h-[150px] w-full rounded-xl",
        content: `Congratulations on your Emerald Banner`,
      },
      goldbanner: {
        style:
          "bg-[#FFD700] p-4 flex items-center justify-center font-bold text-white shadow-lg   text-2xl border-[10px] text-center border-[#fff085] h-[150px] w-full rounded-xl",
        content: `Congratulations on your Gold Banner`,
      },
      bronzebanner: {
        style:
          "bg-[#9E5E23] p-4 flex items-center justify-center font-bold text-white shadow-lg   text-2xl border-[10px] text-center border-[#E0AF7D] h-[150px] w-full rounded-xl",
        content: `Congratulations on your Bronze Banner`,
      },
    };
    setBanner(
      bannerMap[mostExpensiveBanner.name.toLowerCase().replace(/\s/g, "")]
    );
    return;
  };

  // Effect: Fetch user data and handle initial setup
  useEffect(() => {
    const handleGetUser = async () => {
      let response = null;
      try {
        response = await axios.get("/api/auth/get-user");
        if (response?.data?.cached) {
          setCached(true);
        }
        setUserCoins(response?.data?.user.currency);
        if (response?.data?.user?.investors) {
          console.log("got user");
          const result = await axios.post("/api/investor");
          const { totalQuantity } = result.data;
          setUserCoins(totalQuantity);
        }
        getIcon(response?.data?.user as User);
        getBanner(response?.data?.user as User);
        setUser?.(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleGetUser();
  }, [setUser]);

  // Effect: Set time-based greeting
  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return "Good morning";
      if (hours < 18) return "Good afternoon";
      return "Good evening";
    };

    setGreeting(getGreeting());
  }, []);

  // Event Handlers
  const handleCopyReferral = async () => {
    const referralCode = user?._id ?? "";
    await navigator.clipboard.writeText(referralCode);
  };

  const toggleImageError = () => {
    setImageError((prevState) => !prevState);
  };

  return (
    <div className="mb-10">
      {/* Greeting Section */}
      <div className="flex flex-col items-center mt-8">
        {cached && (
          <div className="flex items-center text-[12px] space-x-2 text-gray-600 font-medium">
            <p>Old data because you reached your limit</p>
          </div>
        )}
        {user != null ? (
          <h1 className="text-xl md:text-4xl font-bold text-gray-800">
            {greeting ? `${greeting}!` : "Loading greeting..."}
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

      {/* Study Options Grid */}
      <div className="lg:px-16 lg:p-6 px-2">
        <div className="grid grids-cols-1 md:grid-cols-3 mx-auto md:w-4/5 gap-2 mt-px">
          {user != null ? (
            <Option
              icon={<Book />}
              header="Reading & Writing"
              redirect="/reading-writing"
            />
          ) : (
            <Skeleton className="w-full h-[64px] bg-gray-700/60" />
          )}
          {user != null ? (
            <Option
              icon={<EqualApproximately />}
              header="Math"
              redirect="/math"
            />
          ) : (
            <Skeleton className="w-full h-[64px] bg-gray-700/60" />
          )}
          {user != null ? (
            <Option
              icon={<Calendar />}
              header="Study Plan"
              redirect="/dashboard/study-plan"
            />
          ) : (
            <Skeleton className="w-full h-[64px] bg-gray-700/60" />
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="lg:flex lg:space-x-2 mt-1.5 p-3.5">
        <div className="shadow-lg rounded-lg w-full bg-white p-4 flex lg:items-center flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center mb-3 ">
            <div className="relative">
              {user != null ? (
                <>
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
                </>
              ) : (
                <Skeleton className="w-[120px] h-[120px] rounded-2xl bg-gray-400" />
              )}
              {icon ? (
                <>
                  <Image
                    src={`/icons/rewards/${icon}.png`}
                    alt="Icon"
                    width={80}
                    height={80}
                    className="absolute -right-6 -top-6"
                  />
                </>
              ) : null}
            </div>
            <div className="ml-6">
              {user == null ? (
                <Skeleton className="w-[200px] h-[35px] rounded-full bg-blue-600" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">{user.name}</p>
              )}
              {user != null ? (
                <p>Email: {user?.email}</p>
              ) : (
                <Skeleton className="w-[200px] h-[24px] mt-4 rounded-full bg-gray-400" />
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
                <p className="text-gray-700 flex items-center">
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

      {/* Statistics Section */}
      <div className="p-3.5">
        <div className="lg:flex lg:space-x-2 mt-1.5 mb-4">
          {user != null ? (
            <StatDisplay
              type="coins"
              color="black"
              icon="coin"
              header="DailySAT Coins:"
              number={userCoins ?? 0}
            />
          ) : (
            <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60" />
          )}
          {user != null ? (
            <StatDisplay
              type="attempts"
              color="green"
              icon="checked"
              header="Correct Answers:"
              number={user?.correctAnswered ?? 0}
            />
          ) : (
            <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60" />
          )}
          {user != null ? (
            <StatDisplay
              type="attempts"
              color="#ff5454"
              icon="cross"
              header="Mistakes:"
              number={user?.wrongAnswered ?? 0}
            />
          ) : (
            <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60" />
          )}
          {user != null ? (
            <Link href="/shop" className="w-full">
              <StatDisplay
                type="items bought"
                color="#2563EA"
                icon="shop"
                header="Shop:"
                number={user?.itemsBought?.length || 0}
              />
            </Link>
          ) : (
            <Skeleton className="w-full h-[200px] mb-2 bg-gray-600/60" />
          )}
        </div>

        {/* Achievement Banner */}
        {user != null &&
        user.itemsBought &&
        user.itemsBought.find((elem: ShopItem) =>
          elem.name.includes("Banner")
        ) &&
        banner.style ? (
          <div className={banner.style}>
            <p>{`${banner.content}${user != null ? `, ${user?.name.split(" ")[0]}!` : "!"}`}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
