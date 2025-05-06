import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ShopItem } from "@/types/shopitem";
import { DisplayBanner } from "@/types/dashboard/banner";

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
  const bannerMap: { [key: string]: DisplayBanner } = {
    diamondbanner: {
      style:
        "bg-[#00d3f2] p-1 flex items-center justify-center font-bold text-white shadow-lg font-satoshi border-[4px] text-center border-[#a2f4fd] w-[80px] h-[30px] absolute top-0 right-0 rounded-xl",
      content: `Congratulations on your Diamond Banner`,
    },
    emeraldbanner: {
      style:
        "bg-[#009966] p-1 flex items-center justify-center font-bold text-white shadow-lg font-satoshi border-[4px] text-center border-[#5ee9b5] w-[80px] h-[30px] absolute top-0 right-0 rounded-xl",
      content: `Congratulations on your Emerald Banner`,
    },
    goldbanner: {
      style:
        "bg-[#FFD700] p-1 flex items-center justify-center font-bold text-white shadow-lg font-satoshi border-[4px] text-center border-[#fff085] w-[80px] h-[30px] absolute top-0 right-0 rounded-xl",
      content: `Congratulations on your Gold Banner`,
    },
    bronzebanner: {
      style:
        "bg-[#9E5E23] p-1 flex items-center justify-center font-bold text-white shadow-lg font-satoshi border-[4px] text-center border-[#E0AF7D] w-[80px] h-[30px] absolute top-0 right-0 rounded-xl",
      content: `Congratulations on your Bronze Banner`,
    },
  };
  return (
    <>
      <div className="flex flex-col relative z-10 font-satoshi items-center justify-center w-full h-full ">
        {name.includes("Icon") ? (
          <img
            src={`/icons/rewards/${name.toLowerCase().replace(/\s/g, "")}.png`}
            alt="Icon"
            width={50}
            height={50}
            className="absolute -right-2 z-10 -top-2"
          />
        ) : (
          <></>
        )}
        {name.includes("Banner") ? (
          <div
            className={bannerMap[name.toLowerCase().replace(/\s/g, "")].style}
          ></div>
        ) : (
          <></>
        )}
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
                      userItemsBought &&
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
