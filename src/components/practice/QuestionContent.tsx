import React from "react";

type QuestionContentProps = {
  isLoading: boolean;
  currentQuestion: any;
  subject: string;
  selectedDomain: string;
  showDesmos?: boolean;
  setShowDesmos?: React.Dispatch<React.SetStateAction<boolean>>;
  handleMarkForLater: () => void;
  currentQuestionStatus: any;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isViewingAnsweredHistory: boolean;
  handleAnswerSelect: (key: string) => void;
  isCorrect: boolean | null;
  handleSubmit: () => void;
  showNext: () => void;
  showExplanation: boolean;
  isMarked: boolean;
};

export const QuestionContent: React.FC<QuestionContentProps> = ({
  isLoading,
  currentQuestion,
  subject,
  selectedDomain,
  showDesmos,
  setShowDesmos,
  handleMarkForLater,
  currentQuestionStatus,
  selectedAnswer,
  isSubmitted,
  isViewingAnsweredHistory,
  handleAnswerSelect,
  isCorrect,
  handleSubmit,
  showNext,
  showExplanation,
  isMarked,
}) => {
  if (isLoading) return <p>Loading question...</p>;
  if (!currentQuestion) return <p>No questions found for the selected filters. Please try a different selection.</p>;

  return (
    <>
      <div className="mb-4 p-3 bg-blue-50 rounded-md shadow flex justify-between items-center text-sm text-black">
        <div>
          {!(subject === "English" && selectedDomain === "All") && (
            <span className="font-bold">Topic: {currentQuestion.domain} | </span>
          )}
          <span className="font-bold">Difficulty:</span> {currentQuestion.difficulty}
        </div>
        <div className="flex gap-2">
          {subject === "Math" && (
            <button
              onClick={() => setShowDesmos?.(!showDesmos)}
              className={`px-3 py-1 text-xs font-bold rounded border shadow flex items-center gap-1 ${showDesmos ? 'bg-blue-100 border-blue-500 text-blue-500' : 'bg-white border-gray-300 text-gray-600'}`}
              title="Launch Desmos Calculator"
            >
              <i className="fas fa-calculator"></i>
            </button>
          )}
          <button
            onClick={handleMarkForLater}
            className={`px-3 py-1 text-xs font-bold rounded border shadow flex items-center gap-1 transition-all duration-200 ${isMarked ? 'bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
            title="Mark for Review"
          >
            <i className={`fa-bookmark ${isMarked ? 'fas text-yellow-600' : 'far'}`}></i>
            {isMarked ? 'Marked' : 'Mark for Review'}
          </button>
        </div>
      </div>

      {subject === "English" && currentQuestion.question.paragraph && (
        <div
          className="mb-5 p-4 bg-gray-100 rounded border border-gray-300 text-base leading-relaxed max-h-52 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: currentQuestion.question.paragraph }}
        />
      )}

      <div className="mb-5 text-base font-bold text-black">
        <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.question }} />
      </div>

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
              onClick={() => !isViewingAnsweredHistory && !isSubmitted && handleAnswerSelect(key)}
              disabled={isViewingAnsweredHistory || isSubmitted}
              className={`block w-full px-4 py-3 mb-2 rounded border ${borderColor} ${backgroundColor} ${textColor} text-left text-base shadow transition-opacity relative ${isViewingAnsweredHistory || isSubmitted ? 'cursor-default' : 'hover:opacity-90'}`}
            >
              <div dangerouslySetInnerHTML={{ __html: `${key}. ${value}` }} />
              {(isViewingAnsweredHistory || isSubmitted) && isCorrectChoice && (
                <i className="fas fa-check absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
              )}
              {(isViewingAnsweredHistory || isSubmitted) && isSelected && !isCorrectChoice && (
                <i className="fas fa-times absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600"></i>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        {!isViewingAnsweredHistory && !isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`px-6 py-3 bg-blue-600 text-white font-bold text-base rounded shadow ${!selectedAnswer ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={showNext}
            className="px-6 py-3 bg-blue-600 text-white font-bold text-base rounded shadow hover:bg-blue-700"
          >
            Next <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>

      {(showExplanation || isViewingAnsweredHistory) && (
        <div className="mt-5 p-4 bg-gray-100 border border-gray-300 rounded text-black">
          {isCorrect ? (
            <div className="font-bold mb-2 text-green-600">Correct!</div>
          ) : (
            <>
              <div className="font-bold mb-2 text-red-600">Incorrect</div>
              <div className="mb-2">
                Your answer: <span className="font-bold text-red-600">{selectedAnswer}</span>
              </div>
              <div className="mb-2">
                Correct answer: <span className="font-bold text-green-600">{currentQuestion.question.correct_answer}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.explanation }} />
            </>
          )}
        </div>
      )}
    </>
  );
};
