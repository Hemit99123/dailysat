import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { User } from "@/types/user";

export default function UserCoinDisplay() {
  const user = useUserStore((state) => state.user);
  const [coins, setCoins] = useState(-1);

  useEffect(() => {
    // Fetch the user doc from the backend using the user's email
    const fetchUserDoc = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get("/api/auth/get-user");
        const userDoc = await res.data.user;
        setCoins(userDoc.currency ?? -1);
      } catch (err) {
        setCoins(-1);
      }
    };

    fetchUserDoc();

    // Event handler function for coin updates
    const handleUserUpdate = (e: Event) => {
      const price = (e as CustomEvent<{ price: number }>).detail.price;
      setCoins((prev) => prev + price);
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

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
