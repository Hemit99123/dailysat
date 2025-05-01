import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface ShopItem {
  name: string;
  purpose: string;
  price: number;
  amnt: number;
}
const ShopItemDisplay: React.FC<ShopItem> = ({
  name,
  purpose,
  price,
  amnt,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="mt-2 text-gray-600">
              {purpose || "We couldn't find a purpose"}
            </p>
            <p className="mt-4 text-lg font-semibold">{price} coins</p>
            <p className="mt-4 text-lg font-semibold">
              You already own {amnt} of these
            </p>
            <div className="flex flex-row items-center w-full">
              <div className="w-1/3 flex justify-center ">
                <Button className="mt-4 hover:bg-transparent  text-lg font-semibold bg-transparent rounded-full w-[40px] h-[40px] border-black border">
                  <Minus color="black" />
                </Button>
              </div>
              <div className="w-1/3 flex justify-center items-center font-bold text-5xl">
                <span>{amnt}</span>
              </div>
              <div className="w-1/3 flex justify-center items-center">
                <Button className="mt-4 hover:bg-transparent flex justify-center items-center text-lg font-semibold bg-transparent rounded-full w-[40px] h-[40px] border-black border">
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
