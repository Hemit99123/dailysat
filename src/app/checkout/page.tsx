"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import React, { useEffect } from "react";

const Checkout: React.FC = () => {
  const [receipt, setReceipt] = React.useState<{ [key: string]: number }[]>([]);
  const NamePriceMap: { [key: string]: [string, number] } = {
    coininvestori: ["Coin Investor I", 120],
    coininvestorii: ["Coin Investor II", 230],
    coininvestoriii: ["Coin Investor III", 350],
    coininvestoriv: ["Coin Investor IV", 460],
  };
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  // const [coins, setCoins] = useState(0);
  const getUser = async () => {
    const params = window.location.href.split("?")[1];
    const response = await axios.get("/api/auth/get-user");
    setUser?.(response?.data?.user);
    setReceipt(() => {
      const newReceipt = params.split("&").map((item) => {
        const [key, value] = item.split("=");
        console.log(item);
        return {
          [decodeURIComponent(key)]: parseInt(decodeURIComponent(value)),
        };
      });
      const total = receipt.reduce((acc, item) => {
        const key = Object.keys(item)[0];
        return acc + item[key] * NamePriceMap[key][1];
      }, 0);

      if (user?.currency && total > response?.data?.user?.currency) {
        alert(
          "You do not have enough currency to buy this item. Please buy more currency."
        );
        window.location.href = "/shop";
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
          <div className="w-full max-w-md mt-4 bg-[#4D68C3] max-h-[400px] overflow-scroll  text-white rounded-xl shadow-lg p-6">
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
                <Button className="w-full font-bold bg-white hover:bg-[#4D68C3] hover:text-white text-[#4D68C3]">
                  Buy Now
                </Button>
              </span>
            </div>
          </div>
        ) : (
          <>
            <Skeleton className="w-full max-w-md mt-4 bg-[#4D68C3] h-[300px] text-white rounded-lg shadow-lg p-6"></Skeleton>
          </>
        )}
      </div>
    </>
  );
};
export default Checkout;
