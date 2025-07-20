"use client";

import React from "react";
import { useShop } from "@/hooks/useShop";
import UserCoinDisplay from "@/components/features/Shop/UserCoinDisplay";
import ShopHeader from "@/components/features/Shop/ShopHeader";
import ShopGridTabs from "@/components/features/Shop/ShopGridTabs";
import ItemGrid from "@/components/features/Shop/ItemGrid";
import CheckoutButton from "@/components/features/Shop/CheckoutButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Shop() {
  const {
    user,
    coins,
    state,
  } = useShop();

  const isLoading = !user;

  return (
    <div className="px-4">
      <UserCoinDisplay coins={coins.amnt} />

      <div className="flex lg:flex-row flex-col items-center lg:space-y-0 space-y-2 lg:space-x-4">
        <ShopHeader />
        <ShopGridTabs />
      </div>

      <div className="text-center mt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[40px] mx-auto w-[200px] rounded-3xl bg-black/80" />
            <Skeleton className="h-[30px] mt-2 mx-auto w-[300px] rounded-3xl bg-black/60" />
          </>
        ) : (
          <>
            <h3 className="font-bold text-3xl">DailySAT Shop</h3>
            <p className="font-thin">Browse & see what’s interesting to you!</p>
          </>
        )}
      </div>

      <ItemGrid coins={coins} state={state} />
      <CheckoutButton state={state} />
    </div>
  );
}
