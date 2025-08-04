import React, { useEffect } from "react";
import { Button } from "@/components/common/Button";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user";

// Add type declaration for our custom event
interface BuyItemsEvent {
  items: { [key: string]: number };
}

declare global {
  interface WindowEventMap {
    "buy-items": CustomEvent<BuyItemsEvent>;
  }
}

export default function CheckoutButton() {
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    const handleBuyItems = (e: CustomEvent<BuyItemsEvent>) => {
      const itemsToBuy = Object.entries(e.detail.items).filter(
        ([_, val]) => val > 0
      );
      if (itemsToBuy.length === 0) {
        setTimeout(() => {
          toast.error("Please buy items before you continue.", {
            position: "bottom-right",
            pauseOnHover: false,
            autoClose: 300,
          });
        }, 800);
        return;
      }

      const query = itemsToBuy.map(([key, val]) => `${key}=${val}`).join("&");
      window.location.href = `/checkout?${query}`;
    };

    window.addEventListener("buy-items", handleBuyItems);
    return () => window.removeEventListener("buy-items", handleBuyItems);
  }, []);

  if (!user) {
    return (
      <Skeleton className="mt-2 mb-16 flex flex-col bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px]" />
    );
  }

  return (
    <Button
      onClick={async () => {
        window.dispatchEvent(new CustomEvent("get-items-to-buy"));
      }}
      className="font-bold mt-2 mb-16 flex flex-col hover:bg-[#6986e3] transition-all duration-300 bg-[#4D68C3] rounded-2xl items-center justify-center w-full h-[100px] text-3xl text-white"
    >
      Checkout
    </Button>
  );
}
