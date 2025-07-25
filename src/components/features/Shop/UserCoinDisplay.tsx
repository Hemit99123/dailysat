import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";

export default function UserCoinDisplay() {
  const user = useUserStore((state) => state.user);
  const [coins, setCoins] = useState(-1);

  useEffect(() => {
    // Set coins to user's currency whenever user changes
    setCoins(user?.currency ?? -1);

    // Event handler function for coin updates
    const handleUserUpdate = (e: Event) => {
      const price = (e as CustomEvent<{ price: number }>).detail.price;
      setCoins((prev) => prev + price);
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, [user]);

  return (
    <div className="fixed bg-blue-700 rounded-3xl bottom-2 right-2 z-50">
      {coins !== -1 ? (
        <div className="text-white bg-transparent px-2 py-2">{coins} coins</div>
      ) : (
        <Skeleton className="h-[40px] bg-transparent w-[80px] z-10" />
      )}
    </div>
  );
}
