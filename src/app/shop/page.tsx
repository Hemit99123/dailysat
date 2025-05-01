"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { CircleHelp, Store } from "lucide-react";
import React, { useEffect, useState } from "react";
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

export default function Shop() {
  const { toast } = useToast();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const handleGetUserAuth = async () => {
      let response = null;
      try {
        response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleGetUserAuth();
  }, [setUser]);
  return (
    <div className="px-4 flex lg:flex-row flex-col items-center lg:space-y-0 space-y-2 lg:space-x-4">
      {user != null ? (
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
              Welcome to the shop! Here you can buy items to help you study and
              improve your SAT score.
            </p>
          </div>
          <img
            src="assets/study-graphic-fin.png"
            className="lg:h-[150px] h-[100px] medium:hidden absolute -bottom-2 right-2 "
            alt=""
          />
        </div>
      ) : (
        <Skeleton className="lg:w-4/5 w-full h-[200px] rounded-2xl bg-gradient-to-tr from-[#4D68C3] via-[#4D68C3] to-[#9db2f7] "></Skeleton>
      )}
      {user != null ? (
        <div className="lg:w-1/4 w-full  bg-gradient-to-tr from-[#F5863F] to-[#f5a16d] flex items-center relative h-[175px] rounded-2xl p-8 text-white ">
          <div>
            <h1 className="font-bold inline text-7xl text-white">
              {user.itemsBought?.length | 0}
            </h1>
            <span className="font-satoshi ">
              &nbsp;{user.itemsBought?.length === 1 ? "Item" : "Items"} Bought
            </span>

            <AlertDialog>
              <AlertDialogTrigger>
                <div
                  onClick={(e) => {
                    if (user.itemsBought?.length === 0) {
                      toast({
                        title: "You have no items",
                        description:
                          "You cannot view your items if you have none",
                        className: "bg-[#4D68C3] border-none text-white",
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
                        <span key={index + 0.1} className="text-center w-1/3">
                          <b>Price:</b> {item.price} coins
                        </span>
                        <br />
                        <span key={index + 0.2} className="text-center w-1/3">
                          <b>Amount:</b> {item.amnt}
                        </span>
                        <br />
                        <span key={index + 0.3} className="text-center w-1/3">
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
                              {item.purpose || "Item does not have a purpose"}
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
        <Skeleton className="lg:w-1/5 w-full  bg-gradient-to-tr from-[#F5863F] to-[#f5a16d] h-[200px] rounded-2xl"></Skeleton>
      )}
    </div>
  );
}
