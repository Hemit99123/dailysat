"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAnswerStore, useQuestionStore } from "@/store/questions";
import { BookmarkIcon, Highlighter, Eraser } from "lucide-react";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";
import { answerCorrectRef } from "@/lib/questions/answer";

interface ReadingQuestionProps {
  onAnswerSubmit: (isCorrect: boolean) => void;
  moveToNextQuestion: () => void;
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({ 
  onAnswerSubmit,
  moveToNextQuestion
}) => {
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  
  const [mode, setMode] = useState<"highlight" | "clear" | null>(null);
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [userAnswered, setUserAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserAnswered(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
  }, [randomQuestion, setSelectedAnswer]);

  const toggleMode = (newMode: "highlight" | "clear") => {
    setMode((prevMode) => (prevMode === newMode ? null : newMode));
  };

  const handleSelection = () => {
    if (!mode || !textRef.current) return;
    const selection = window.getSelection();
    if (selection?.rangeCount) {
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
    span.onclick = () => span.replaceWith(document.createTextNode(span.textContent || ""));
    range.deleteContents();
    range.insertNode(span);
  };

  const clearRange = (range: Range) => {
    const parent = range.commonAncestorContainer.parentElement;
    parent?.querySelectorAll("span[style='background-color: yellow;']").forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent || ""));
    });
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
      textRef.current?.querySelectorAll("span[style='background-color: yellow;']").forEach(span => {
        span.replaceWith(document.createTextNode(span.textContent || ""));
      });
      moveToNextQuestion();
    }
  };

  return (
    <div className="flex flex-col items-start">
      {/* Toolbar */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <button onClick={() => toggleMode("highlight")} className={`p-2 rounded ${mode === "highlight" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            <Highlighter size={20} />
          </button>
          <button onClick={() => toggleMode("clear")} className={`p-2 rounded ${mode === "clear" ? "bg-red-500 text-white" : "bg-gray-200"}`}>
            <Eraser size={20} />
          </button>
          <QuestionSharedUI crossOffMode={crossOffMode} setCrossOffMode={setCrossOffMode} />
        </div>
        <button onClick={() => setMarkedForReview(!markedForReview)} className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${markedForReview ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
          <BookmarkIcon size={16} />
          <span>{markedForReview ? 'Marked' : 'Mark for Review'}</span>
        </button>
      </div>

      {/* Two-column layout */}
      <div className="w-full flex flex-row">
        {/* Question content */}
        <div className="w-3/5 p-6 border-r border-gray-300 min-h-screen">
          <div 
            ref={textRef}
            className="relative text-lg"
            onMouseUp={handleSelection}
            style={{ cursor: mode ? "text" : "default" }}
            dangerouslySetInnerHTML={{ __html: randomQuestion?.question || "" }}
          />
          
          {userAnswered && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-bold mb-2 text-gray-700">
                {isCorrect ? 'Correct' : 'Incorrect'}
              </h3>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: randomQuestion?.explanation || "" }} />
            </div>
          )}
        </div>

        {/* Answer section */}
        <div className="w-2/5 p-6">
          <div className={`mb-4 p-3 rounded-md flex justify-between items-center ${markedForReview ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <span className="font-bold">Question</span>
            <span className={`px-2 py-1 rounded text-xs ${isCorrect ? 'bg-gray-100 text-gray-800' : userAnswered ? 'bg-gray-100 text-gray-800' : 'bg-gray-100'}`}>
              {userAnswered ? (isCorrect ? 'Answered' : 'Try Again') : 'Unanswered'}
            </span>
          </div>

          <div className="mb-3 font-semibold">Choose 1 answer:</div>
          <div className="space-y-3 mb-6">
            <MultipleChoice 
              crossOffMode={crossOffMode}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={!userAnswered ? setSelectedAnswer : () => {}}
              disabled={userAnswered && !isCorrect}
              correctAnswer={userAnswered ? randomQuestion?.correctAnswer : undefined}
            />
          </div>

          {!userAnswered ? (
            <button
              onClick={handleSubmit}
              className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 font-medium"
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : isCorrect ? (
            <button
              onClick={handleContinue}
              className="w-full mt-4 px-4 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleTryAgain}
              className="w-full mt-4 px-4 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingQuestion;