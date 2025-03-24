import React, { useState, useEffect } from "react";
import { Answers } from "@/types/sat-platform/answer";
import { useAnswerStore, useAnswerCorrectStore, useQuestionStore } from "@/store/questions";
import { CalculatorIcon } from "lucide-react";
import { useCalcOptionModalStore } from "@/store/modals";
import CalcOption from "../../Modals/CalcOption";
import { parseContent } from "@/lib/latex";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions"; // Import the shared UI component
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";

const MathQuestion: React.FC<{ onAnswerSubmit: (answer: Answers) => void }> = ({
  onAnswerSubmit,
}) => {
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  
  // Remove null from the state type
  const [crossOffMode, setCrossOffMode] = useState(false);
  
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    onAnswerSubmit(selectedAnswer);
    setSelectedAnswer(null);
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


      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!selectedAnswer}
      >
        Submit Answer
      </button>
      <CalcOption />
    </div>
  );
};

export default MathQuestion;
