"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import { Difficulty } from "@/types/practice/difficulty";
import { EnglishSubjects, Type } from "@/types/practice/subject";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calculator,
  Check,
  X as CloseIcon,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { useCalculatorModalStore } from "@/store/modals";
import { handleFetchQuestion } from "@/lib/practice/index";
import { QuestionData } from "@/types/practice/questions";
import { handleSubmitQuestion } from "@/lib/server-actions/submitQuestionAction";
import { toast } from "react-toastify";

interface QuestionContentProps {
  subject: EnglishSubjects;
  type: Type;
  difficulty: Difficulty;
  onAnswered?: (isCorrect: boolean) => void;
}

const MARKDOWN_PROPS = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeRaw as any, rehypeKatex],
};

const QuestionContent: React.FC<QuestionContentProps> = ({
  subject,
  type,
  difficulty,
  onAnswered,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = useCalculatorModalStore((state) => state.isOpen);
  const openModal = useCalculatorModalStore((state) => state.openModal);
  const closeModal = useCalculatorModalStore((state) => state.closeModal);

  const fetchQuestion = async () => {
    setError(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);

    try {
      const response = await handleFetchQuestion(
        type,
        difficulty as Difficulty,
        subject as EnglishSubjects
      );
      setCurrentQuestion(response.data);
    } catch (err) {
      setError("Failed to fetch question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // No need to set isLoading to true as the component mounted with that val
    fetchQuestion();
  }, [type, difficulty, subject]);

  const handleAnswerSelect = (key: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(key);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const isCorrect =
      selectedAnswer === currentQuestion.questionMeta.question.correct_answer;

    handleSubmitQuestion(isCorrect)
      .then(() => {
        toast.success("Question submitted!");
      })
      .catch((error) => {
        toast.error(error);
      });

    setIsCorrect(isCorrect);
    setIsSubmitted(true);
    setShowExplanation(true);

    if (onAnswered) {
      onAnswered(isCorrect);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-[50px] bg-black/20 mb-5" />
        <Skeleton className="w-full h-[30px] mb-2 bg-black/30" />
        {[1, 2, 3, 4].map((item, index) => (
          <Skeleton key={index} className="w-full h-[50px] mb-2" />
        ))}
        <Skeleton className="w-28 h-12 mb-2 bg-black/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchQuestion}
          className="rounded bg-blue-600 px-6 py-3 text-base font-bold text-white shadow hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const markdown = (content: string) => (
    <ReactMarkdown {...MARKDOWN_PROPS}>{content}</ReactMarkdown>
  );

  return (
    <>
      {/* Metadata bar */}
      <div className="flex flex-col md:flex-row md:mb-4 items-center justify-between rounded-md bg-blue-50 p-3 text-sm shadow md:gap-3 md:p-3">
        <div className="text-black">
          {!(type === "english" && subject === "All") &&
            currentQuestion?.questionMeta?.subject && (
              <>
                <strong>Topic:</strong> {subject} {"  "}
                <span className="mx-2">|</span>
              </>
            )}
          <span className="font-bold">Difficulty:</span>{" "}
          {currentQuestion?.questionMeta?.difficulty || difficulty}
        </div>

        {/* Btn section */}
        <div className="flex space-x-2">
          {type === "math" && (
            <button
              onClick={() => {
                if (isOpen) closeModal();
                else openModal();
              }}
              className={`flex items-center gap-1 rounded border px-3 py-1 text-xs font-bold shadow transition-all ${
                isOpen
                  ? "border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calculator size={16} />
              Calculator
            </button>
          )}

          <button
            onClick={() => {
              setIsLoading(true);
              fetchQuestion();
            }}
            className="flex items-center gap-1 rounded border px-3 py-1 text-xs font-bold shadow transition-all border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          >
            <RefreshCcw size={16} />
            Get new question
          </button>
        </div>
      </div>

      {/* English paragraph */}
      {type === "english" &&
        currentQuestion?.questionMeta?.question?.paragraph && (
          <div className="mb-5 max-h-52 overflow-y-auto rounded border border-gray-300 bg-gray-100 p-4 leading-relaxed text-base">
            {markdown(currentQuestion.questionMeta.question.paragraph)}
          </div>
        )}

      {/* Question */}
      <div className="mb-5 text-base font-bold text-black">
        {currentQuestion?.questionMeta?.question?.question &&
          markdown(currentQuestion.questionMeta.question.question)}
      </div>

      {/* Choices */}
      <div className="mb-5">
        {(currentQuestion?.questionMeta?.question?.choices &&
          Object.entries(currentQuestion.questionMeta.question.choices).map(
            ([key, value]) => {
              const isSelected = selectedAnswer === key;
              const isCorrectChoice =
                key === currentQuestion.questionMeta.question.correct_answer;

              let borderColor = "border-gray-300";
              let backgroundColor = "bg-white";
              let textColor = "text-black";

              if (isSubmitted) {
                if (isCorrectChoice) {
                  borderColor = "border-green-500";
                  backgroundColor = "bg-green-50";
                  textColor = "text-green-800";
                }
                if (isSelected) {
                  if (isCorrectChoice) {
                    borderColor = "border-green-500";
                    backgroundColor = "bg-green-50";
                    textColor = "text-green-800";
                  } else {
                    borderColor = "border-red-500";
                    backgroundColor = "bg-red-50";
                    textColor = "text-red-800";
                  }
                }
              } else if (isSelected) {
                borderColor = "border-blue-500";
                backgroundColor = "bg-blue-100";
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={isSubmitted}
                  className={`mb-2 relative block w-full rounded border px-4 py-3 text-left text-base shadow transition-opacity ${borderColor} ${backgroundColor} ${textColor} ${
                    isSubmitted ? "cursor-default" : "hover:opacity-90"
                  }`}
                >
                  <ReactMarkdown
                    {...MARKDOWN_PROPS}
                    components={{
                      p: ({ children }) => (
                        <span className="inline">{children}</span>
                      ),
                    }}
                  >
                    {`${key}. ${value}`}
                  </ReactMarkdown>

                  {isSubmitted && isCorrectChoice && (
                    <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-green-600" />
                  )}
                  {isSubmitted && isSelected && !isCorrectChoice && (
                    <CloseIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-red-600" />
                  )}
                </button>
              );
            }
          )) ||
          null}
      </div>

      {/* Submit / Next buttons */}
      <div className="flex gap-3">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`rounded bg-blue-600 px-6 py-3 text-base font-bold text-white shadow transition-colors ${
              !selectedAnswer
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-blue-700"
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={fetchQuestion}
            className="rounded bg-blue-600 px-6 py-3 text-base font-bold text-white shadow hover:bg-blue-700"
          >
            Next <ArrowRight size={16} className="inline ml-1" />
          </button>
        )}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-5 rounded border border-gray-300 bg-gray-100 p-4 text-black">
          {isCorrect ? (
            <div className="mb-2 font-bold text-green-600">Correct!</div>
          ) : (
            <>
              <div className="mb-2 font-bold text-red-600">Incorrect</div>
              <div className="mb-2">
                Your answer:{" "}
                <span className="font-bold text-red-600">{selectedAnswer}</span>
              </div>
              <div className="mb-2">
                Correct answer:{" "}
                <span className="font-bold text-green-600">
                  {currentQuestion?.questionMeta?.question?.correct_answer}
                </span>
              </div>
              {currentQuestion?.questionMeta?.question?.explanation &&
                markdown(currentQuestion.questionMeta.question.explanation)}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default QuestionContent;
