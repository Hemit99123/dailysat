import React, { useState } from 'react'
import AnswerOption from '../AnswerOption'
import { Answers } from '@/types/sat-platform/answer';
import { useQuestionStore } from '@/store/questions';
import { toggleCrossOffOption } from '@/lib/questions/crossOff';

interface MultipleChoiceProps {
  crossOffMode: boolean;
  selectedAnswer: Answers | null;
  setSelectedAnswer: (answer: Answers | null) => void;
  disabled: boolean;
  correctAnswer: number | undefined;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ crossOffMode, selectedAnswer, setSelectedAnswer, disabled, correctAnswer }) => {
    
    const [crossedOffOptions, setCrossedOffOptions] = useState<Set<Answers>>(new Set());
    const randomQuestion = useQuestionStore((state) => state.randomQuestion);

    const handleAnswerClick = (answer: Answers) => {
        if (crossOffMode) {
            toggleCrossOffOption(setCrossedOffOptions, answer);
        } else {
            setSelectedAnswer(answer);
        }
    };

  return (
    <div>
      <div className="space-y-2">
        <AnswerOption
          text={randomQuestion?.optionA || ""}
          onClick={() => handleAnswerClick("A")}
          isSelected={selectedAnswer === "A"}
          isCrossedOff={crossedOffOptions.has("A")}
        />
        <AnswerOption
          text={randomQuestion?.optionB || ""}
          onClick={() => handleAnswerClick("B")}
          isSelected={selectedAnswer === "B"}
          isCrossedOff={crossedOffOptions.has("B")}
        />
        <AnswerOption
          text={randomQuestion?.optionC || ""}
          onClick={() => handleAnswerClick("C")}
          isSelected={selectedAnswer === "C"}
          isCrossedOff={crossedOffOptions.has("C")}
        />
        <AnswerOption
          text={randomQuestion?.optionD || ""}
          onClick={() => handleAnswerClick("D")}
          isSelected={selectedAnswer === "D"}
          isCrossedOff={crossedOffOptions.has("D")}
        />
      </div>
    </div>
  )
}

export default MultipleChoice;
