import React from "react";

interface WorkshopItemProps {
  title: string;
  people: string;
  desc: string;
  icon: React.ReactElement;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({
  title,
  people,
  desc,
  icon,
}) => {
  return (
    <div className="flex flex-row items-center space-x-4 bg-gray-50 w-full rounded-lg shadow-md p-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-700">{people}</p>
        <p className="font-semibold">{desc}</p>
      </div>
    </div>
  );
};

export default WorkshopItem;
