"use client";
import React, { useEffect } from "react";

const Checkout: React.FC = () => {
  const [recept, setReceipt] = React.useState<{ [key: string]: number }[]>([]);
  useEffect(() => {
    const params = window.location.href.split("?")[1];
    setReceipt(() => {
      console.log(
        params.split("&").map((item) => {
          const [key, value] = item.split("=");
          console.log(item);
          return {
            [decodeURIComponent(key)]: parseInt(decodeURIComponent(value)),
          };
        })
      );
      return params.split("&").map((item) => {
        const [key, value] = item.split("=");
        console.log(item);
        return {
          [decodeURIComponent(key)]: parseInt(decodeURIComponent(value)),
        };
      });
    });
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="w-full max-w-md mt-4 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Receipt</h2>
          {recept.map((item, index) => {
            const key = Object.keys(item)[0];
            return (
              <div key={index} className="flex justify-between mb-2">
                <span>{key}</span>
                <span>{item[key]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Checkout;
