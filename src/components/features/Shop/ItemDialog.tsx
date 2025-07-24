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
import { Store } from "lucide-react";
import { toast } from "react-toastify";

export default function ItemDialog({ user }: { user: any }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          onClick={(e) => {
            if (!user.itemsBought?.length) {
              e.stopPropagation();
              toast.error("You don't have any items to display", {
                position: "bottom-right",
                pauseOnHover: false,
              });
              return;
            }
          }}
          className="absolute bg-white p-2 rounded-full bottom-1 left-1"
        >
          <Store color="#F5863F" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            Your Items
          </AlertDialogTitle>
          <AlertDialogDescription className="max-h-[300px] overflow-auto space-y-4">
            {user.itemsBought.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between bg-[#4D68C3] text-white rounded-lg p-4"
              >
                <span className="w-1/3 text-center">
                  <b>Price:</b> {item.price} coins
                </span>
                <span className="w-1/6 text-center">
                  <b>Amnt:</b> {item.amnt}
                </span>
                <span className="w-1/2 text-center">
                  <b>Name:</b> {item.name}
                </span>
              </div>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
