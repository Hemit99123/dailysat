"use client";

import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShopItem } from "@/types/shop/shopItem";
import { redirect } from "next/navigation";

// Helper function to process purchase and append items to user's inventory
const appendItems = async (items: ShopItem[], coins: number) => {
  try {
    await axios.post("/api/shop", {
      items,
      coins,
    });
    toast.success("Your purchase was successful!", {
      position: "bottom-right",
      pauseOnHover: false,
      autoClose: 1000,
    });
    setTimeout(() => {
      redirect("/dashboard");
    }, 1000);
  } catch (error) {
    return {
      code: 500,
      message: `Failed to append items, ${(error as Error).message}`,
    };
  }
};

const Checkout = () => {
  // State management
  const [receipt, setReceipt] = React.useState<{ [key: string]: number }[]>([]);
  const [yourItems, setYourItems] = useState<ShopItem[]>([]);

  // User state from global store
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Map of item IDs to their names and prices
  const namePriceMap: { [key: string]: [string, number] } = {
    coininvestori: ["Coin Investor I", 120],
    coininvestorii: ["Coin Investor II", 230],
    coininvestoriii: ["Coin Investor III", 350],
    coininvestoriv: ["Coin Investor IV", 460],
    owlicon: ["Owl Icon", 300],
    tigericon: ["Tiger Icon", 400],
    sharkicon: ["Shark Icon", 350],
    cheetahicon: ["Cheetah Icon", 250],
    bronzebanner: ["Bronze Banner", 1000],
    goldbanner: ["Gold Banner", 2000],
    diamondbanner: ["Diamond Banner", 3000],
    emeraldbanner: ["Emerald Banner", 5000],
  };

  // Function to fetch user data and process URL parameters
  useEffect(() => {
    const fetchUserAndReceipt = async () => {
      const params = window.location.href.split("?")[1];
      if (!params) {
        toast.error("Come back once you have gone to the shop", {
          position: "bottom-right",
          pauseOnHover: false,
          autoClose: 1000,
        });

        setTimeout(() => {
          redirect("/shop");
        }, 2000);
      }

      // Get data

      // Get the newReceipt from the URL Search parms
      const newReceipt = params.split("&").map((item) => {
        const [key, value] = item.split("=");
        return {
          [decodeURIComponent(key)]: parseInt(decodeURIComponent(value)),
        };
      });

      // Find the total by doing the appropriate calculations
      const total = newReceipt.reduce((acc, item) => {
        const key = Object.keys(item)[0];
        if (!(key in namePriceMap)) {
          redirect("/shop");
        }
        if (key.includes("banner") && item[key] > 1) {
          redirect("/shop");
        }
        return acc + item[key] * namePriceMap[key][1];
      }, 0);
      const response = await axios.get("/api/auth/get-user");
      const num_coins = response?.data?.user?.currency;
      // Check if user has enough coins
      if (total > num_coins) {
        toast.error(
          "You don't have enough coins to complete this transaction",
          {
            position: "bottom-right",
            pauseOnHover: false,
            autoClose: 1000,
          }
        );

        setTimeout(() => {
          redirect("/shop");
        }, 2000);
        return;
      } else {
        setUser?.(response?.data?.user);
      }

      setReceipt(newReceipt);

      const items = newReceipt.map((entry) => {
        const key = Object.keys(entry)[0];
        const [name, price] = namePriceMap[key];
        return {
          name,
          price,
          purpose: "Purchased item",
          amnt: entry[key],
        };
      });

      setYourItems(items);
    };

    fetchUserAndReceipt();
  }, []);

  // useEffect(() => {
  //   getUser();
  // }, []);

  // Render checkout interface
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full   h-[80vh]">
        <h1 className="text-3xl font-bold text-center">Checkout</h1>
        {/* Show receipt if user is loaded, otherwise show skeleton */}
        {user != null ? (
          // Receipt card
          <div className="md:w-[500px] w-[99%] sm:w-[90%] mt-4 bg-[#4D68C3] text-white rounded-lg shadow-lg p-6">
            {/* Receipt header */}
            <h2 className="text-2xl font-semibold mb-4">Receipt</h2>
            {/* Column headers */}
            <div className="flex justify-between mb-2">
              <span className="font-bold w-2/5 text-left">Item</span>
              <span className="font-bold w-1/3 text-right">Amount</span>
              <span className="font-bold w-1/3 text-right">Price</span>
            </div>
            {/* Receipt items */}
            {receipt.map((item, index) => {
              const key = Object.keys(item)[0];
              return (
                <div key={index} className="flex justify-between w-full mb-2">
                  <span className="w-1/3 md:text-lg text-sm max-w-[150px] overflow-hidden">
                    {namePriceMap[key][0]}
                  </span>
                  <span className="w-1/3 text-right">{[item[key]]}</span>
                  <span className="w-1/3 text-right">
                    {namePriceMap[key][1]}
                  </span>
                </div>
              );
            })}
            {/* Total amount */}
            <div className="flex justify-between mb-2">
              <span className="font-bold w-1/2 text-left"></span>
              <span className="font-bold w-1/3 text-right">Total:</span>
              <span className="w-1/6 text-right">
                {receipt.reduce((acc, item) => {
                  const key = Object.keys(item)[0];
                  return acc + item[key] * namePriceMap[key][1];
                }, 0)}
              </span>
            </div>
            {/* Purchase confirmation drawer */}
            <div className="flex justify-between mb-2">
              <span className="font-bold w-1/2 text-left"></span>
              <span className="font-bold w-1/2 text-right">
                <Drawer>
                  <DrawerTrigger className="w-full font-bold py-2 rounded-lg bg-white hover:bg-[#4D68C3] shadow-lg duration-150 hover:text-white text-[#4D68C3]">
                    Buy Now
                  </DrawerTrigger>
                  <DrawerContent className=" ">
                    <DrawerHeader>
                      <DrawerTitle>
                        Are you sure you want to buy these items?
                      </DrawerTitle>
                      <DrawerDescription>
                        This action cannot be undone.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button
                        className="py-8 text-xl rounded-xl"
                        onClick={() => {
                          appendItems(yourItems, user.currency);
                        }}
                      >
                        Buy Items
                      </Button>
                      <DrawerClose>Close</DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </span>
            </div>
          </div>
        ) : (
          <>
            <Skeleton className="md:w-[500px] w-[99%] sm:w-[90%] mt-4 bg-[#4D68C3] h-[300px] text-white rounded-lg shadow-lg p-6"></Skeleton>
          </>
        )}
      </div>
    </>
  );
};

export default Checkout;
