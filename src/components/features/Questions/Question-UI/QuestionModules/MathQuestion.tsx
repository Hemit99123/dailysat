import React, { useState, useRef, useEffect } from "react";
import AnswerOption from "../AnswerOption";
import { Answers } from "@/types/sat-platform/answer";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore } from "@/store/questions";
import { QuestionsProps } from "@/types/sat-platform/questions";
import { toggleCrossOffMode, toggleCrossOffOption } from "@/lib/questions/crossOff";
import { CalculatorIcon } from "lucide-react";
import { useCalcOptionModalStore } from "@/store/modals";
import CalcOption from "../../Modals/CalcOption";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathQuestion: React.FC<QuestionsProps> = ({ onAnswerSubmit }) => {
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [crossedOffOptions, setCrossedOffOptions] = useState<Set<Answers> | null>(new Set());
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
      setCrossedOffOptions(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  const handleAnswerClick = (answer: Answers) => {
    if (crossOffMode) {
      toggleCrossOffOption(setCrossedOffOptions, answer);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    onAnswerSubmit(selectedAnswer);
    setSelectedAnswer(null);
  };

  const handleOpenCalcModal = useCalcOptionModalStore((state) => state.openModal);

  const parseContent = (content: string) => {
    const parts = content.split(/(\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  if (!randomQuestion) {
    return <div>Loading...</div>;
  }

  const options: Record<Answers, string> = {
    A: randomQuestion.optionA,
    B: randomQuestion.optionB,
    C: randomQuestion.optionC,
    D: randomQuestion.optionD,
  };

  return (
    <div className="flex flex-col items-start px-8 -mt-6">
      <div className="flex items-center mb-2 space-x-4">
        <button onClick={handleOpenCalcModal}>
          <CalculatorIcon />
        </button>
        <button
          onClick={() => toggleCrossOffMode(setCrossOffMode)}
          className={`p-1 rounded ${
            crossOffMode ? "bg-blue-300 text-white" : "bg-gray-300"
          }`}
        >
          Cross off
        </button>
      </div>
      
      {/* Question Text with LaTeX rendering */}
      <p className="mb-5 text-xl relative" ref={textRef}>
        {parseContent(randomQuestion.question || "")}
      </p>
      
      <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
      <div className="w-full space-y-2">
        {Object.entries(options).map(([letter, text]) => (
          <AnswerOption
            key={letter}
            text={text}
            onClick={() => handleAnswerClick(letter as Answers)}
            isSelected={selectedAnswer === letter}
            isCrossedOff={crossedOffOptions?.has(letter as Answers) || false}
          />
        ))}
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