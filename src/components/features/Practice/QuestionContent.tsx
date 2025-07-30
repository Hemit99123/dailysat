import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Question, QuestionHistory } from "@/hooks/usePracticeSession";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Calculator,
  Bookmark,
  Check,
  X as CloseIcon,
  ArrowRight,
} from "lucide-react";
import { useCalculatorModalStore } from "@/store/modals";

interface QuestionContentProps {
  isLoading: boolean;
  currentQuestion: Question | null;
  subject: string;
  selectedDomain: string;
  handleMarkForLater: () => void;
  currentQuestionStatus: QuestionHistory | null;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isViewingAnsweredHistory: boolean;
  handleAnswerSelect: (key: string) => void;
  isCorrect: boolean | null;
  handleSubmit: () => void;
  showNext: () => void;
  showExplanation: boolean;
  isMarked: boolean;
  showDesmos: boolean;
  setShowDesmos: () => void;
}
const MARKDOWN_PROPS = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeRaw as any, rehypeKatex],
};

export const QuestionContent: React.FC<QuestionContentProps> = ({
  isLoading,
  currentQuestion,
  subject,
  selectedDomain,
  handleMarkForLater,
  selectedAnswer,
  isSubmitted,
  isViewingAnsweredHistory,
  handleAnswerSelect,
  isCorrect,
  handleSubmit,
  showNext,
  showExplanation,
  isMarked,
  showDesmos,
  setShowDesmos,
}) => {

  const isOpen = useCalculatorModalStore(state => state.isOpen);
  const openModal = useCalculatorModalStore(state => state.openModal);
  const closeModal = useCalculatorModalStore(state => state.closeModal);

  const handleOpenCalculator = () => {
    if (isOpen) {
      closeModal()
    } else {
      openModal()
    }
  }

  if (isLoading) return (
    <div>
      <Skeleton className="w-full h-[50px] bg-black/20 mb-5" />
      <Skeleton className="w-full h-[30px] mb-2 bg-black/30" />
      {[1,2,3,4].map((item, index) => (
        <Skeleton key={index} className="w-full h-[50px] mb-2"/>
      ))}
      <Skeleton className="w-28 h-12 mb-2 bg-black/50" />
    </div>
  );
  if (!currentQuestion)
    return (
      <p>
        No questions found for the selected filters. Please try a different
        selection.
      </p>
    );
  const markdown = (content: string) => (
    <ReactMarkdown {...MARKDOWN_PROPS}>{content}</ReactMarkdown>
  );
  return (
    <>
      {/* Metadata bar (topic, difficulty, actions)*/}
      <div className="flex flex-col md:flex-row md:mb-4 items-center justify-between rounded-md bg-blue-50 p-3 text-sm shadow md:gap-3 md:p-3">
        <div className="text-black">
          {!(subject === "English" && selectedDomain === "All") && (
            <span>
              <strong>Topic:</strong> {currentQuestion.domain} |{" "}
            </span>
          )}
          <span className="font-bold">Difficulty:</span> {" "}
          {currentQuestion.difficulty}
        </div>
        <div className="flex gap-2">
          {subject === "Math" && (
            <button
              type="button"
              onClick={handleOpenCalculator}
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
            onClick={handleMarkForLater}
            className={`flex items-center gap-1 rounded border px-3 py-1 text-xs font-bold shadow transition-all ${
              isMarked
                ? "border-yellow-400 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            }`}
            title="Mark for Review"
          >
            <Bookmark
              className={`h-4 w-4 ${isMarked ? "fill-yellow-600 stroke-yellow-600" : ""}`}
            />
            {isMarked ? "Marked" : "Mark for Review"}
          </button>
        </div>
      </div>

      {/* English passage / paragraph (can be raw HTML + markdown)*/}
      {subject === "English" && currentQuestion.question.paragraph && (
        <div className="mb-5 max-h-52 overflow-y-auto rounded border border-gray-300 bg-gray-100 p-4 leading-relaxed text-base">
          {markdown(currentQuestion.question.paragraph)}
        </div>
      )}

      {/* Question stem*/}
      {subject != "vocab" && (
      <div className="mb-5 text-base font-bold text-black">
        {markdown(currentQuestion.question.question)}
      </div>
      )}

      {subject === "vocab" && (
      <div className="mb-5 text-base font-bold text-black">
        Which of the following options is best described by the following defenition?
        <span className="mb-5 text-base font-normal">{markdown(currentQuestion.question.question)}</span>
      </div>
      )}

      {/* Answer choices*/}
      <div className="mb-5">
        {Object.entries(currentQuestion.question.choices).map(([key, value]) => {
          const isSelected = selectedAnswer === key;
          const isCorrectChoice = key === currentQuestion.question.correct_answer;

          let borderColor = "border-gray-300";
          let backgroundColor = "bg-white";
          let textColor = "text-black";

          if (isViewingAnsweredHistory || isSubmitted) {
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
              onClick={() =>
                !isViewingAnsweredHistory && !isSubmitted && handleAnswerSelect(key)
              }
              disabled={isViewingAnsweredHistory || isSubmitted}
              className={`mb-2 relative block w-full rounded border px-4 py-3 text-left text-base shadow transition-opacity ${borderColor} ${backgroundColor} ${textColor} ${
                isViewingAnsweredHistory || isSubmitted
                  ? "cursor-default"
                  : "hover:opacity-90"
              }`}
            >
              <ReactMarkdown
                {...MARKDOWN_PROPS}
                components={{
                  p: ({ children }) => <span className="inline">{children}</span>,
                }}
              >
                {`${key}. ${value}`}
              </ReactMarkdown>

              {(isViewingAnsweredHistory || isSubmitted) && isCorrectChoice && (
                <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-green-600" />
              )}
              {(isViewingAnsweredHistory || isSubmitted) && isSelected && !isCorrectChoice && (
                <CloseIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-red-600" />
              )}
            </button>
          );
        })}
      </div>


      {/* Action buttons (Submit / Next)*/}
      <div className="flex gap-3">
        {!isViewingAnsweredHistory && !isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`rounded bg-blue-600 px-6 py-3 text-base font-bold text-white shadow transition-colors ${
              !selectedAnswer ? "cursor-not-allowed opacity-60" : "hover:bg-blue-700"
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={showNext}
            className="rounded bg-blue-600 px-6 py-3 text-base font-bold text-white shadow hover:bg-blue-700"
          >
            Next <ArrowRight size={16} className="inline ml-1" />
          </button>
        )}
      </div>

      {/* Explanation panel*/}
      {(showExplanation || isViewingAnsweredHistory) && (
        <div className="mt-5 rounded border border-gray-300 bg-gray-100 p-4 text-black">
          {isCorrect ? (
            <div className="mb-2 font-bold text-green-600">Correct!</div>
          ) : (
            <>
              <div className="mb-2 font-bold text-red-600">Incorrect</div>
              <div className="mb-2">
                Your answer: <span className="font-bold text-red-600">{selectedAnswer}</span>
              </div>
              <div className="mb-2">
                Correct answer: <span className="font-bold text-green-600">{currentQuestion.question.correct_answer}</span>
              </div>
              {markdown(currentQuestion.question.explanation)}
            </>
          )}
        </div>
      )}
    </>
  );
};
