"use client";

// Core UI Components
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ShopItemDisplay from "@/components/common/ShopItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// State Management and Utilities
import { useUserStore } from "@/store/user";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Store } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { ShopItem } from "@/types/shopitem";

export default function Shop() {
  // Hooks and Global State
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Local State
  const [coins, setCoins] = useState({ amnt: -1 });
  const [grid, setGrid] = useState("investor");

  // Shop Categories Help Text
  const Notes = {
    investor: "Go to dashboard to see claim your coins!",
    animal:
      "You can only buy one of each. You can't buy one if you already have it. The most expensive one is the one that is shown.",
    banners:
      "You can only buy one of each. You can't buy one if you already have it.",
  };

  // Shop Items Configuration
  const Items = {
    investor: [
      {
        name: "Coin Investor I",
        price: 120,
        purpose: "Gain 5 coins per day",
      },
      {
        name: "Coin Investor II",
        price: 230,
        purpose: "Gain 10 coins per day",
      },
      {
        name: "Coin Investor III",
        price: 350,
        purpose: "Gain 15 coins per day",
      },
      {
        name: "Coin Investor IV",
        price: 460,
        purpose: "Gain 20 coins per day",
      },
    ],
    animal: [
      {
        name: "Cheetah Icon",
        price: 250,
        purpose: "Have a cheetah icon up next to your name on the dashboard!",
      },
      {
        name: "Owl Icon",
        price: 300,
        purpose: "Have an owl icon up next to your name on the dashboard!",
      },
      {
        name: "Shark Icon",
        price: 350,
        purpose: "Have a shark icon up next to your name on the dashboard!",
      },
      {
        name: "Tiger Icon",
        price: 400,
        purpose: "Have a tiger icon up next to your name on the dashboard!",
      },
    ],
    banners: [
      {
        name: "Bronze Banner",
        price: 1000,
        purpose: "Have a bronze ribbon show up dashboard!",
      },
      {
        name: "Gold Banner",
        price: 2000,
        purpose: "Have a gold ribbon show up dashboard!",
      },
      {
        name: "Diamond Banner",
        price: 3000,
        purpose: "Have a diamond ribbon show up dashboard!",
      },
      {
        name: "Emerald Banner",
        price: 5000,
        purpose: "Have an emerald ribbon show up dashboard!",
      },
    ],
  };

  // Shopping Cart Initial State
  const initialState: { [key: string]: number } = {
    coininvestori: 0,
    coininvestorii: 0,
    coininvestoriii: 0,
    coininvestoriv: 0,
    owlicon: 0,
    tigericon: 0,
    sharkicon: 0,
    cheetahicon: 0,
    bronzebanner: 0,
    goldbanner: 0,
    emeraldbanner: 0,
    diamondbanner: 0,
  };

  // Shopping Cart Reducer
  function reducer(
    state: typeof initialState,
    action: { type: string; payload?: string }
  ) {
    action.payload = action.payload?.toLowerCase().replace(/\s/g, "");
    const matchedItem = (Items as { [key: string]: ShopItem[] })[
      grid as string
    ]?.find(
      (item: ShopItem) =>
        item.name.toLowerCase().replace(/\s/g, "") === action.payload
    );

    switch (action.type) {
      case "increment":
        setCoins((prev) => ({
          amnt: prev["amnt"] - (matchedItem?.price || 0),
        }));
        return {
          ...state,
          [action.payload as string]: state[action.payload as string] + 1,
        };
      case "decrement":
        setCoins((prev) => ({
          amnt: prev["amnt"] + (matchedItem?.price || 0),
        }));
        return {
          ...state,
          [action.payload as string]: Math.max(
            0,
            state[action.payload as string] - 1
          ),
        };
      default:
        return state;
    }
  }

  // Initialize Shopping Cart State
  const [state, dispatch] = useReducer(reducer, initialState);

  // Effect: Fetch User Data
  useEffect(() => {
    const handleGetUserAuth = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user);
        setCoins({ amnt: response.data.user?.currency });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleGetUserAuth();
  }, [setUser]);
  return (
    <>
      <div className="px-4  ">
        <div className="fixed  bg-blue-700 rounded-3xl bottom-2 right-2 z-50">
          {user != null && coins.amnt != -1 ? (
            <div
              id="usercoins"
              className=" text-white bg-transparent px-2 py-2 "
            >
              {coins["amnt"] || 0} coins
            </div>
          ) : (
            <Skeleton className=" h-[40px] bg-transparent  w-[80px] z-10"></Skeleton>
          )}
        </div>
        <div className="flex lg:flex-row flex-col items-center lg:space-y-0 space-y-2 lg:space-x-4">
          {user != null && coins.amnt != -1 ? (
            <div className="lg:w-3/4 w-full bg-gradient-to-tr from-[#4D68C3] via-[#4D68C3] to-[#9db2f7] relative medium:h-[200px]  rounded-2xl px-8 py-12 text-white flex items-center">
              <div className="font-bold text-5xl text-white">
                Welcome,{" "}
                <span className="inline-block  text-white w-[290px] overflow-hidden text-ellipsis whitespace-nowrap align-bottom">
                  {user?.name.split(" ").length === 2
                    ? user?.name.split(" ")[0]
                    : user?.name}
                  !
                </span>
                <p className="text-xs font-light   mt-4">
                  Welcome to the shop! Here you can buy items to help you study
                  and improve your SAT score.
                </p>
              </div>
              <img
                src="assets/study-graphic-fin.png"
                className="lg:h-[150px] h-[100px] medium:hidden absolute -bottom-2 right-2 "
                alt="Study Graphic"
              />
            </div>
          ) : (
            <Skeleton className="lg:w-3/4 w-full h-[175px] rounded-2xl bg-gradient-to-tr from-[#4D68C3] via-[#4D68C3] to-[#9db2f7] "></Skeleton>
          )}
          {user != null && coins.amnt != -1 ? (
            <div className="lg:w-1/4 w-full  bg-gradient-to-tr from-[#F5863F] to-[#f5a16d] flex items-center relative h-[175px] rounded-2xl p-8 text-white ">
              <div>
                <h1 className="font-bold inline text-7xl text-white">
                  {user.itemsBought?.length | 0}
                </h1>
                <span className="  ">
                  &nbsp;{user.itemsBought?.length === 1 ? "Item" : "Items"}{" "}
                  Bought
                </span>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <div
                      onClick={(e) => {
                        if (user.itemsBought?.length === 0) {
                          toast({
                            title: "You have no items",
                            description: "We can't find any items you bought",
                            className: "bg-[#4D68C3] border-none text-white  ",
                          });
                          e.stopPropagation();
                          return;
                        } else {
                          console.log(user.itemsBought);
                        }
                      }}
                      className="absolute bg-white p-2 rounded-full bottom-1 left-1"
                    >
                      <Store color="#F5863F"></Store>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader className=" ">
                      <AlertDialogTitle className="text-center text-2xl">
                        Your Items
                      </AlertDialogTitle>
                      <AlertDialogDescription className="max-h-[300px] flex flex-col space-y-4 overflow-auto">
                        {user.itemsBought?.map((item, index) => (
                          <span
                            key={index}
                            className="relative flex bg-[#4D68C3] text-white rounded-lg p-4 justify-between"
                          >
                            <span
                              key={index + 0.1}
                              className="text-center w-1/3"
                            >
                              <b>Price:</b> {item.price} coins
                            </span>
                            <br />
                            <span
                              key={index + 0.2}
                              className="text-center w-1/6"
                            >
                              <b>Amount:</b> {item.amnt}
                            </span>
                            <br />
                            <span
                              key={index + 0.3}
                              className="text-center w-1/2"
                            >
                              <b>Name:</b> {item.name}
                            </span>
                            <TooltipProvider key={index + 0.4}>
                              <Tooltip key={index + 0.5}>
                                <TooltipTrigger
                                  key={index + 0.6}
                                  className="absolute bottom-0 left-0   rounded-full p-1"
                                >
                                  ?
                                </TooltipTrigger>
                                <TooltipContent key={index + 0.7}>
                                  {item.purpose ||
                                    "Item does not have a purpose"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                        ))}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <Skeleton className="lg:w-1/4 w-full  bg-gradient-to-tr from-[#F5863F] to-[#f5a16d] h-[175px] rounded-2xl"></Skeleton>
          )}
        </div>
        <div>
          <div className="  text-center mt-4">
            {coins.amnt != -1 && user != null ? (
              <h3 className="font-bold text-3xl">DailySAT Shop</h3>
            ) : (
              <Skeleton className="h-[40px] bg-black/80 rounded-3xl w-[200px]"></Skeleton>
            )}
            {coins.amnt != -1 && user != null ? (
              <p className="font-thin">
                Browse & see what&apos;s interesting to you!{" "}
              </p>
            ) : (
              <Skeleton className="h-[30px] bg-black/60 rounded-3xl mt-2 w-[300px]"></Skeleton>
            )}
          </div>
          <div className="md:w-[600px] w-[350px] mx-auto h-[80px] flex items-center">
            {user != null && coins.amnt != -1 ? (
              <div className="flex items-center w-1/3 py-6 justify-center space-x-2 mt-4">
                <Button
                  onClick={() => {
                    setGrid("investor");
                  }}
                  className={`${
                    grid != "investor" ? "bg-[#4D68C3] text-white" : ""
                  }   rounded-full px-4 py-2`}
                >
                  Investor
                </Button>
              </div>
            ) : (
              <Skeleton className="h-[40px] w-1/3 bg-[#4D68C3] rounded-full"></Skeleton>
            )}
            {user != null && coins.amnt != -1 ? (
              <div className="flex items-center w-1/3 py-6 justify-center space-x-2 mt-4">
                <Button
                  onClick={() => {
                    setGrid("animal");
                  }}
                  className={`${
                    grid != "animal" ? "bg-[#4D68C3] text-white" : ""
                  }   rounded-full px-4 py-2`}
                >
                  Animal Icon
                </Button>
              </div>
            ) : (
              <Skeleton className="h-[40px] w-1/3 bg-[#4D68C3] rounded-full"></Skeleton>
            )}
            {user != null && coins.amnt != -1 ? (
              <div className="flex items-center w-1/3 py-6 justify-center space-x-2 mt-4">
                <Button
                  onClick={() => {
                    setGrid("banners");
                  }}
                  className={`${
                    grid != "banners" ? "bg-[#4D68C3] text-white" : ""
                  }   rounded-full px-4 py-2`}
                >
                  Banners
                </Button>
              </div>
            ) : (
              <Skeleton className="h-[40px] w-1/3 bg-[#4D68C3] rounded-full"></Skeleton>
            )}
          </div>
          {coins.amnt != -1 && user != null ? (
            <>
              <div>
                <p className="  text-gray-500 text-center mt-2">
                  {(Notes as { [key: string]: string })[grid as string]}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                {(
                  Items as {
                    [key: string]: ShopItem[];
                  }
                )[grid as string].map((item: ShopItem, index: number) => (
                  <ShopItemDisplay
                    key={index}
                    name={`${item.name}`}
                    purpose={`${item.purpose}`}
                    price={item.price}
                    state={state}
                    dispatch={dispatch}
                    coins={coins}
                    userItemsBought={user.itemsBought}
                  ></ShopItemDisplay>
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
              <Skeleton className="flex flex-col   items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col   items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col   items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col   items-center justify-center w-full h-[200px]"></Skeleton>
            </div>
          )}
        </div>
        <div>
          {coins.amnt != -1 && user != null ? (
            <div>
              <Button
                onClick={() => {
                  if (
                    Object.keys(state).filter((key) => state[key] !== 0)
                      .length === 0
                  ) {
                    toast({
                      title: "No items selected",
                      description: "Please select at least one item to buy",
                      className: "bg-[#4D68C3] border-none text-white  ",
                    });
                    return;
                  }
                  redirect(
                    `/checkout?${Object.keys(state)
                      .filter((key) => state[key] !== 0)
                      .map((key) => `${key}=${state[key]}`)
                      .join("&")}`
                  );
                }}
                className="font-bold mt-2 mb-16 flex flex-col   hover:bg-[#6986e3] transition-all duration-300 bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px] text-3xl text-white"
              >
                Checkout
              </Button>
            </div>
          ) : (
            <Skeleton className="mt-2 mb-16 flex flex-col   bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px] "></Skeleton>
          )}
        </div>
      </div>
    </>
  );
}
