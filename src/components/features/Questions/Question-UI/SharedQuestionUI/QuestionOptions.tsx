import React from "react";
import { toggleCrossOffMode } from "@/lib/questions/crossOff";
import { useQuestionStore } from "@/store/questions";
import axios from "axios";

interface QuestionOptionsProp {
  crossOffMode: boolean;
  setCrossOffMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionOption: React.FC<QuestionOptionsProp> = ({
  crossOffMode,
  setCrossOffMode,
}) => {
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);

  const handleBugReport = async () => {
    if (!randomQuestion?._id) return;
    await axios.get(`/api/report/bug?id=${randomQuestion._id}`);
    window.location.reload();
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center mb-2 space-x-4">
        <button
          onClick={() => toggleCrossOffMode(setCrossOffMode)}
          className={`p-1 rounded ${crossOffMode ? "bg-blue-300 text-white" : "bg-gray-300"}`}
        >
          Cross off
        </button>
        <p
          className="text-xs font-extralight hover:text-red-500 hover:cursor-pointer transition-all"
          onClick={handleBugReport}
        >
          {randomQuestion?._id} Report this question as bugged
        </p>
      </div>
      {/* You can add more shared UI elements here if needed */}
    </div>
  );
};

export default QuestionOption;
