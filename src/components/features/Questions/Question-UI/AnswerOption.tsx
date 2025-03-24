import React from "react";
import { parseContent } from "@/lib/latex";

interface AnswerOptionProps {
  text: string;
  onClick: () => void;
  isSelected?: boolean; // Optional prop to indicate selection
  isCrossedOff?: boolean; // Optional prop to indicate whether it's crossed off
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  text,
  onClick,
  isSelected,
  isCrossedOff,
}) => {

  return (
    <div
      className={`cursor-pointer p-2 border rounded transition-all 
        ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"} 
        ${isCrossedOff ? "line-through text-gray-400 bg-gray-200" : ""}
      `}
      onClick={onClick}
    >
      {parseContent(text)}
    </div>
  );
};

export default AnswerOption;
