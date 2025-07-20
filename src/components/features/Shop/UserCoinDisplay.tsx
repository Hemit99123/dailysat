import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user"; 

interface Props {
    coins: number;
}

export default function UserCoinDisplay({ coins }: Props) {
    const user = useUserStore((state) => state.user);

    return (
        <div className="fixed bg-blue-700 rounded-3xl bottom-2 right-2 z-50">
            {user && coins !== -1 ? (
                <div className="text-white bg-transparent px-2 py-2">
                    {coins} coins
                </div>
            ) : (
                <Skeleton className="h-[40px] bg-transparent w-[80px] z-10" />
            )}
        </div>
    );
}
