import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ShopItem } from "@/types/shopitem";

interface ComponentShopItem {
  name: string;
  purpose: string;
  price: number;
  dispatch?: (action: { type: string; payload?: string }) => void;
  state: {
    [key: string]: number | string;
  };
  coins: { [key: string]: number };
  userItemsBought: ShopItem[];
}
const ShopItemDisplay: React.FC<ComponentShopItem> = ({
  name,
  purpose,
  price,
  dispatch,
  state,
  coins,
  userItemsBought,
}) => {
  return (
    <>
      <div className="flex flex-col font-satoshi items-center justify-center w-full h-full ">
        <div className="w-full bg-white rounded-lg border-gray-300 border ">
          <div className="p-4">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="mt-1 text-lg font-semibold">{price} coins</p>
            <p className="mt-1 text-gray-600">
              {purpose || "We couldn't find a purpose"}
            </p>
            <div className="w-full lg:w-1/2 mt-2 flex flex-row items-center justify-start lg:justify-end">
              <div className="w-1/3 flex justify-center ">
                <Button
                  onClick={() => {
                    dispatch?.({ type: "decrement", payload: name });
                  }}
                  disabled={state[name.toLowerCase().replace(/\s/g, "")] === 0}
                  className="hover:scale-125 transition-transform duration-300 hover:bg-transparent hover:text-white shadow-lg flex justify-center items-center text-lg font-semibold bg-transparent rounded-full w-[35px] h-[35px] border-black border"
                >
                  <Minus color="black" />
                </Button>
              </div>
              <div className="w-1/3 flex justify-center font-satoshi items-center my-1 font-bold text-5xl">
                <span>{state[name.toLowerCase().replace(/\s/g, "")]}</span>
              </div>
              <div className="w-1/3 h-full flex justify-center items-center">
                <Button
                  onClick={() => {
                    dispatch?.({ type: "increment", payload: name });
                  }}
                  disabled={
                    price > coins.amnt ||
                    (!name
                      .toLowerCase()
                      .replace(/\s/g, "")
                      .includes("investor") &&
                      userItemsBought.some((item) => item.name === name)) ||
                    (!name
                      .toLowerCase()
                      .replace(/\s/g, "")
                      .includes("investor") &&
                      state[name.toLowerCase().replace(/\s/g, "")] === 1)
                  }
                  className="hover:scale-125 transition-transform duration-300 hover:bg-transparent hover:text-white shadow-lg flex justify-center items-center text-lg font-semibold bg-transparent rounded-full w-[35px] h-[35px] border-black border"
                >
                  <Plus color="black" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopItemDisplay;
