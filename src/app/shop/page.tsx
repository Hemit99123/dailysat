"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { Store } from "lucide-react";
import React, { useEffect, useReducer, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import ShopItemDisplay from "@/components/common/ShopItem";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const { toast } = useToast();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [coins, setCoins] = useState({ amnt: -1 });
  function reducer(
    state: typeof initialState,
    action: { type: string; payload?: string }
  ) {
    action.payload = action.payload?.toLowerCase().replace(/\s/g, "");
    const matchedItem = Items?.find(
      (item) => item.name.toLowerCase().replace(/\s/g, "") === action.payload
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
  const Items = [
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
  ];
  useEffect(() => {
    const handleGetUserAuth = async () => {
      let response = null;
      try {
        response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user);
        console.log(response.data.user);
        setCoins({ amnt: response.data.user?.currency });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleGetUserAuth();
  }, [setUser]);
  const initialState: { [key: string]: number } = {
    coininvestori: 0,
    coininvestorii: 0,
    coininvestoriii: 0,
    coininvestoriv: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <div className="px-4 font-satoshi">
        <div className="fixed  bg-blue-700 rounded-3xl bottom-2 right-2 ">
          {user != null && coins.amnt != -1 ? (
            <div
              id="usercoins"
              className=" text-white bg-transparent px-2 py-2 z-10"
            >
              {coins["amnt"] || 200} coins
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
                <p className="text-xs font-light font-satoshi mt-4">
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
                <span className="font-satoshi ">
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
                            className:
                              "bg-[#4D68C3] border-none text-white font-satoshi",
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
                    <AlertDialogHeader className="font-satoshi">
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
                              className="text-center w-1/3"
                            >
                              <b>Amount:</b> {item.amnt}
                            </span>
                            <br />
                            <span
                              key={index + 0.3}
                              className="text-center w-1/3"
                            >
                              <b>Name:</b> {item.name}
                            </span>
                            <TooltipProvider key={index + 0.4}>
                              <Tooltip key={index + 0.5}>
                                <TooltipTrigger
                                  key={index + 0.6}
                                  className="absolute bottom-0 left-0 font-satoshi rounded-full p-1"
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
          <div className="font-satoshi  mt-4">
            <h3 className="font-bold text-3xl">DailySAT Shop</h3>
            <p className="font-thin">
              Browse & see what&apos;s interesting to you!{" "}
            </p>
          </div>
          {coins.amnt != -1 && user != null ? (
            <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
              {Items.map((item, index) => (
                <ShopItemDisplay
                  key={index}
                  name={item.name}
                  purpose={item.purpose}
                  price={item.price}
                  state={state}
                  dispatch={dispatch}
                  coins={coins}
                ></ShopItemDisplay>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
              <Skeleton className="flex flex-col font-satoshi items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col font-satoshi items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col font-satoshi items-center justify-center w-full h-[200px]"></Skeleton>
              <Skeleton className="flex flex-col font-satoshi items-center justify-center w-full h-[200px]"></Skeleton>
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
                      className:
                        "bg-[#4D68C3] border-none text-white font-satoshi",
                    });
                    return;
                  }
                  window.location.href = `/checkout?${Object.keys(state)
                    .filter((key) => state[key] !== 0)
                    .map((key) => `${key}=${state[key]}`)
                    .join("&")}`;
                }}
                className="font-bold mt-2 mb-16 flex flex-col font-satoshi hover:bg-[#6986e3] transition-all duration-300 bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px] text-3xl text-white"
              >
                Checkout
              </Button>
            </div>
          ) : (
            <Skeleton className="mt-2 mb-16 flex flex-col font-satoshi bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px] "></Skeleton>
          )}
        </div>
      </div>
    </>
  );
}
