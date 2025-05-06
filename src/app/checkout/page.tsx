"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { ShopItem } from "@/types/shopitem";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
const appendItems = async (items: ShopItem[], coins: number) => {
  try {
    const response = await axios.post("/api/shop", {
      items,
      coins,
    });

    console.log("Success:", response.data);
    toast({
      title: "Items Successfully Bought!",
      description: "Your purchase was successful",
      className: "bg-[#4D68C3] border-none text-white font-satoshi",
    });
    setTimeout(() => {
      redirect("/dashboard");
    }, 500);
  } catch (error) {
    console.error("Error appending items:", (error as Error).message);
    return { code: 500, message: "Failed to append items" };
  }
};
const Checkout: React.FC = () => {
  const [receipt, setReceipt] = React.useState<{ [key: string]: number }[]>([]);
  const NamePriceMap: { [key: string]: [string, number] } = {
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
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [yourItems, setYourItems] = useState<ShopItem[]>([]);
  const getUser = async () => {
    const params = window.location.href.split("?")[1];
    const response = await axios.get("/api/auth/get-user");
    setUser?.(response?.data?.user);
    if (!params) {
      alert("Please come back once you go to the shop");
      redirect("/shop");
    }
    setReceipt(() => {
      const newReceipt = params.split("&").map((item) => {
        const [key, value] = item.split("=");
        console.log(item);
        return {
          [decodeURIComponent(key)]: parseInt(decodeURIComponent(value)),
        };
      });
      const total = newReceipt.reduce((acc, item) => {
        const key = Object.keys(item)[0];
        return acc + item[key] * NamePriceMap[key][1];
      }, 0);
      const num_coins = response?.data?.user?.currency;
      setYourItems(() => {
        return newReceipt.map((entry) => {
          const key = Object.keys(entry)[0];
          const [name, price] = NamePriceMap[key];
          return {
            name,
            price,
            purpose: "Purchased item", // you can refine this as needed
            amnt: entry[key],
          };
        });
      });

      if (total > num_coins) {
        alert(
          "You do not have enough currency to complete this transaction. You will be redirected to the shop."
        );
        redirect("/shop");
      }
      return newReceipt;
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full font-satoshi h-[80vh]">
        <h1 className="text-3xl font-bold text-center">Checkout</h1>
        {user != null ? (
          <div className="md:w-[500px] w-[99%] sm:w-[90%] mt-4 bg-[#4D68C3] text-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Receipt</h2>
            <div className="flex justify-between mb-2">
              <span className="font-bold w-2/5 text-left">Item</span>
              <span className="font-bold w-1/3 text-right">Amount</span>
              <span className="font-bold w-1/3 text-right">Price</span>
            </div>
            {receipt.map((item, index) => {
              const key = Object.keys(item)[0];
              return (
                <div key={index} className="flex justify-between w-full mb-2">
                  <span className="w-1/3 md:text-lg text-sm max-w-[150px] overflow-hidden">
                    {NamePriceMap[key][0]}
                  </span>
                  <span className="w-1/3 text-right">{[item[key]]}</span>
                  <span className="w-1/3 text-right">
                    {NamePriceMap[key][1]}
                  </span>
                </div>
              );
            })}
            <div className="flex justify-between mb-2">
              <span className="font-bold w-1/2 text-left"></span>
              <span className="font-bold w-1/3 text-right">Total:</span>
              <span className="w-1/6 text-right">
                {receipt.reduce((acc, item) => {
                  const key = Object.keys(item)[0];
                  return acc + item[key] * NamePriceMap[key][1];
                }, 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold w-1/2 text-left"></span>
              <span className="font-bold w-1/2 text-right">
                <Drawer>
                  <DrawerTrigger className="w-full  font-bold py-2 rounded-lg bg-white hover:bg-[#4D68C3] shadow-lg duration-150 hover:text-white text-[#4D68C3]">
                    {" "}
                    Buy Now
                  </DrawerTrigger>
                  <DrawerContent className="font-satoshi">
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
