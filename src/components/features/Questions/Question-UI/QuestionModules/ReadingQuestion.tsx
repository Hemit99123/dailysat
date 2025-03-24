// components/ReadingQuestion.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore } from "@/store/questions";
import Image from "next/image";
import { QuestionsProps } from "@/types/sat-platform/questions";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions"; // Importing the new component
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";

const ReadingQuestion: React.FC<QuestionsProps> = ({ onAnswerSubmit }) => {
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const [mode, setMode] = useState<"highlight" | "clear" | null>(null);
  const [crossOffMode, setCrossOffMode] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const toggleMode = (newMode: "highlight" | "clear") => {
    setMode((prevMode) => (prevMode === newMode ? null : newMode));
  };
  
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
      setMode(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer, setMode]);


  const renderHighlightedText = () => {
    return (
      <div
        ref={textRef}
        className="relative"
        onMouseUp={handleSelection}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={handleSelection}
        style={{ cursor: mode ? "text" : "default" }}
      >
        {randomQuestion?.question}
      </div>
    );
  };

  const handleSelection = (event: React.TouchEvent | React.MouseEvent) => {
    if (!mode || !textRef.current) return;

    let selection: Selection | null = null;

    if ("changedTouches" in event) {
      const touch = event.changedTouches[0];
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

      if (selectedText.length > 0) {
        if (mode === "highlight") {
          highlightRange(range);
        } else if (mode === "clear") {
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
    span.onclick = () => clearRangeForSpan(span); // Clear when clicked
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
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="flex flex-col items-start px-8 -mt-6">


<div className="flex items-center mb-2 space-x-4">
        <button
          onClick={() => toggleMode("highlight")}
          className={`p-1 rounded ${
            mode === "highlight" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          <Image
            src={
              mode !== "highlight"
                ? "/icons/highlighter.png"
                : "/icons/full.png"
            }
            alt="Toggle highlight mode"
            className="w-4 h-4"
            width={500}
            height={500}
          />
        </button>
        <button
          onClick={() => toggleMode("clear")}
          className={`p-1 rounded ${
            mode === "clear" ? "bg-red-500 text-white" : "bg-gray-300"
          }`}
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
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!selectedAnswer}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default ReadingQuestion;
