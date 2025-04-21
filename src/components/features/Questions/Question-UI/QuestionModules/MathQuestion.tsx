import React, { useState, useEffect } from "react";
import { Answers } from "@/types/sat-platform/answer";
import { useAnswerStore, useAnswerCorrectStore, useQuestionStore } from "@/store/questions";
import { usePointsEarnedStore } from "@/store/score";
import { CalculatorIcon, Coins } from "lucide-react";
import { useCalcOptionModalStore } from "@/store/modals";
import CalcOption from "../../Modals/CalcOption";
import { parseContent } from "@/lib/latex";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";

const MathQuestion: React.FC<{ onAnswerSubmit: (answer: Answers) => void }> = ({
  onAnswerSubmit,
}) => {
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const lastPointsEarned = usePointsEarnedStore((state) => state.lastPointsEarned);
  
  const [crossOffMode, setCrossOffMode] = useState(false);
  
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    onAnswerSubmit(selectedAnswer);
  };

  const handleOpenCalcModal = useCalcOptionModalStore((state) => state.openModal);

  if (!randomQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start px-8 -mt-6">
      <div className="flex tems-center mb-2 space-x-4">
        <button onClick={handleOpenCalcModal}>
          <CalculatorIcon />
        </button>
        <div className="mt-6">
          <QuestionSharedUI
            crossOffMode={crossOffMode}
            setCrossOffMode={setCrossOffMode}
          />
        </div>

      </div>

      {/* Question Text with LaTeX rendering */}
      <p className="mb-5 text-xl relative">
        {parseContent(randomQuestion.question || "")}
      </p>

      <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
      
      <div className="w-full">
        <MultipleChoice 
          crossOffMode={crossOffMode}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      </div>

      <div className="mt-4 flex flex-col items-start w-full">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          disabled={!selectedAnswer || isAnswerCorrect === true}
        >
          Submit Answer
        </button>

        {isAnswerCorrect === true && lastPointsEarned !== null && (
          <div className="mt-3 flex items-center text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-md text-sm font-medium animate-pulse-fast"> 
            <Coins size={16} className="mr-1.5" />
            Correct! +{lastPointsEarned} Coins
          </div>
        )}
        {isAnswerCorrect === false && (
           <div className="mt-3 text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md text-sm font-medium"> 
            Incorrect, try again or view explanation.
          </div>
        )}
      </div>

      <CalcOption />
    </div>
  );
};

export default MathQuestion;
