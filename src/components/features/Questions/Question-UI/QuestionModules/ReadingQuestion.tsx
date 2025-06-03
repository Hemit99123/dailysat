import React, { useState, useRef } from "react";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore } from "@/store/questions";
import Image from "next/image";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";
import { answerCorrectRef } from "@/lib/questions/answer";

interface ReadingQuestionProps {
  onAnswerSubmit: (isCorrect: boolean) => void;
  moveToNextQuestion: () => void;
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
  onAnswerSubmit,
  moveToNextQuestion,
}) => {
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const [mode, setMode] = useState<"highlight" | "clear" | null>(null);
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswered, setUserAnswered] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);

  const toggleMode = (newMode: "highlight" | "clear") => {
    setMode((prevMode) => (prevMode === newMode ? null : newMode));
  };

  const handleSelection = (event: TouchEvent | MouseEvent) => {
    if (!mode || !textRef.current) return;

    let selection: Selection | null = null;

    if ("changedTouches" in event) {
      const touch = (event as TouchEvent).changedTouches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      if (textRef.current.contains(targetElement)) {
        selection = window.getSelection();
      }
    } else {
      selection = window.getSelection();
    }

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();
      if (selectedText) {
        if (mode === "highlight") {
          highlightRange(range);
        } else {
          clearRange(range);
        }
        selection.removeAllRanges();
      }
    }
  };

  const highlightRange = (range: Range) => {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.textContent = range.toString();
    span.onclick = () => clearRangeForSpan(span);
    range.deleteContents();
    range.insertNode(span);
  };

  const clearRange = (rangeToClear: Range) => {
    const parentElement = rangeToClear.commonAncestorContainer.parentElement;
    if (parentElement) {
      const spans = parentElement.querySelectorAll("span");
      spans.forEach((span) => {
        if (span.style.backgroundColor === "yellow") {
          const textNode = document.createTextNode(span.textContent || "");
          span.replaceWith(textNode);
        }
      });
    }
  };

  const clearRangeForSpan = (span: HTMLElement) => {
    const textNode = document.createTextNode(span.textContent || "");
    span.replaceWith(textNode);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !randomQuestion) return;
    const correct = answerCorrectRef[selectedAnswer] === randomQuestion.correctAnswer;
    setIsCorrect(correct);
    setUserAnswered(true);
    onAnswerSubmit(correct);
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setUserAnswered(false);
    setIsCorrect(null);
  };

  const handleContinue = () => {
    if (isCorrect) {
      textRef.current?.querySelectorAll("span[style='background-color: yellow;']").forEach((span) => {
        span.replaceWith(document.createTextNode(span.textContent || ""));
      });
      moveToNextQuestion();
    }
  };

  const renderHighlightedText = () => {
    return (
      <div
        ref={textRef}
        onMouseOut={(event) => handleSelection(event as unknown as MouseEvent)}
        onTouchEnd={(event) => handleSelection(event as unknown as TouchEvent)}
        className="p-4 border rounded bg-white text-gray-800 w-full mb-4"
      >
        {randomQuestion?.question || "No question loaded."}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start px-8 -mt-6">
      <div className="flex items-center mb-2 space-x-4">
        <button
          onClick={() => toggleMode("highlight")}
          className={`p-1 rounded ${mode === "highlight" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          <Image
            src={mode !== "highlight" ? "/icons/highlighter.png" : "/icons/full.png"}
            alt="Toggle highlight mode"
            className="w-4 h-4"
            width={500}
            height={500}
          />
        </button>
        <button
          onClick={() => toggleMode("clear")}
          className={`p-1 rounded ${mode === "clear" ? "bg-red-500 text-white" : "bg-gray-300"}`}
        >
          <Image
            src={mode !== "clear" ? "/icons/eraser.png" : "/icons/colored.png"}
            alt="Toggle clear highlight mode"
            className="w-4 h-4"
            width={500}
            height={500}
          />
        </button>
        <div className="mt-6">
          <QuestionSharedUI
            crossOffMode={crossOffMode}
            setCrossOffMode={setCrossOffMode}
          />
        </div>
      </div>

      {renderHighlightedText()}

      <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
      <div className="w-full">
        <MultipleChoice
          crossOffMode={crossOffMode}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          disabled={userAnswered}
          correctAnswer={randomQuestion?.correctAnswer}
        />
      </div>

      <div className="flex space-x-4 mt-4">
        {!userAnswered ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        ) : (
          <>
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Try Again
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!isCorrect}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadingQuestion;
