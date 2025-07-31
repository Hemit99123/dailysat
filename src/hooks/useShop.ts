import { useState } from "react";
import { useUserStore } from "@/store/user";

// Define the item counts (shop cart state) type
type CartState = { [key: string]: number };

// Map of item IDs to their names and prices
const namePriceMap: { [key: string]: [string, number, string] } = {
  coininvestori: ["Coin Investor I", 120, "Earn 5 coins daily"],
  coininvestorii: ["Coin Investor II", 230, "Earn 10 coins daily"],
  coininvestoriii: ["Coin Investor III", 350, "Earn 15 coins daily"],
  coininvestoriv: ["Coin Investor IV", 460, "Earn 20 coins daily"],
  owlicon: ["Owl Icon", 300, "Display an owl icon on your profile"],
  tigericon: ["Tiger Icon", 400, "Display a tiger icon on your profile"],
  sharkicon: ["Shark Icon", 350, "Display a shark icon on your profile"],
  cheetahicon: ["Cheetah Icon", 250, "Display a cheetah icon on your profile"],
  bronzebanner: [
    "Bronze Banner",
    1000,
    "Display a bronze banner on your profile",
  ],
  goldbanner: ["Gold Banner", 2000, "Display a gold banner on your profile"],
  diamondbanner: [
    "Diamond Banner",
    3000,
    "Display a diamond banner on your profile",
  ],
  emeraldbanner: [
    "Emerald Banner",
    5000,
    "Display an emerald banner on your profile",
  ],
};

const initialState: CartState = {
  coininvestori: 0,
  coininvestorii: 0,
  coininvestoriii: 0,
  coininvestoriv: 0,
  owlicon: 0,
  tigericon: 0,
  sharkicon: 0,
  cheetahicon: 0,
  bronzebanner: 0,
  goldbanner: 0,
  diamondbanner: 0,
  emeraldbanner: 0,
};
// Custom hook to manage shop state and user currency
export const useShop = () => {
  const [cartState, setCartState] = useState<CartState>(initialState);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const incrementItem = (key: string) => {
    const itemKey = key.toLowerCase().replace(/\s/g, "");
    const [name, price] = namePriceMap[itemKey] || [];

    // If item doesn't exist or user doesn't have enough coins, don't proceed
    if (!name || !user || user.currency < price) {
      return;
    }

    setCartState((prev) => ({
      ...prev,
      [itemKey]: (prev[itemKey] || 0) + 1,
    }));

    if (setUser && user) {
      setUser({
        ...user,
        currency: user.currency - price,
      });
    }
  };

  const decrementItem = (key: string) => {
    const itemKey = key.toLowerCase().replace(/\s/g, "");
    const [name, price] = namePriceMap[itemKey] || [];
    const currentCount = cartState[itemKey] || 0;

    // If item doesn't exist or no items in cart, don't proceed
    if (!name || !user || currentCount <= 0) {
      return;
    }

    setCartState((prev) => ({
      ...prev,
      [itemKey]: currentCount - 1,
    }));

    if (setUser && user) {
      setUser({
        ...user,
        currency: user.currency + price,
      });
    }
  };

  const clear = () => {
    setCartState(initialState);
  };

  return {
    state: cartState,
    increment: incrementItem,
    decrement: decrementItem,
    clear,
    user,
    setUser,
  };
};
