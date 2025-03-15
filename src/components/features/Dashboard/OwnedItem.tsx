import { Items } from '@/types/items';
import Image from 'next/image';
import React from 'react';

interface OwnedItemProps {
  item: Items
}

const OwnedItem: React.FC<OwnedItemProps> = ({ item }) => {
  return (
    <>
      <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50 duration-150">
        {/* Image */}
        <div className="w-12 h-12 flex-shrink-0">
          <Image src={item.url} alt={`${item.name}`} width={100} height={100} className="rounded-full object-cover" />
        </div>

        {/* Name */}
        <div className="flex-1 pl-4">
          <p className="font-bold text-gray-800">{item.name}</p>
        </div>

        {/* Category */}
        <div className="flex-1 text-center">
          <p className="text-gray-600">{item.category}</p>
        </div>

        {/* Worth */}
        <div className="flex-1 text-right">
          <p className="text-gray-800 font-medium">{item.worth} coins</p>
        </div>
      </div>
      <hr className="h-px bg-gray-300 border-0" />
    </>
  );
};

export default OwnedItem;