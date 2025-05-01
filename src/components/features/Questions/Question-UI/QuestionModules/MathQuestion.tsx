"use client";

import React, { useState, useEffect, useRef } from "react";
import { Answers } from "@/types/sat-platform/answer";
import { useAnswerStore, useAnswerCorrectStore, useQuestionStore } from "@/store/questions";
import { CalculatorIcon, BookmarkIcon } from "lucide-react";
import { useCalcOptionModalStore } from "@/store/modals";
import CalcOption from "../../Modals/CalcOption";
import { parseContent } from "@/lib/latex";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";
import Cookies from "js-cookie";
import axios from "axios";
import Result from "../Results";

const MathQuestion = ({ onAnswerSubmit }) => {
  const answerComponent = useRef(null);
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion);
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const setIsAnswerCorrect = useAnswerCorrectStore((state) => state.setIsAnswerCorrect);
  
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [useCustomMathProblems, setUseCustomMathProblems] = useState(false);
  const [useApiProblems, setUseApiProblems] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(false);
  
  // States for API-based questions
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(parseInt(Cookies.get('questionIndex') || '0', 10));
  const [correctCount, setCorrectCount] = useState(parseInt(Cookies.get('correctCount') || '0', 10));
  const [streak, setStreak] = useState(parseInt(Cookies.get('streak') || '0', 10));
  const [difficulty, setDifficulty] = useState('Standard');
  const [options, setOptions] = useState({
    A: { text: "Option A", state: "n" },
    B: { text: "Option B", state: "n" },
    C: { text: "Option C", state: "n" },
    D: { text: "Option D", state: "n" }
  });
  
  // States for custom math problems
  const [currentProblem, setCurrentProblem] = useState(null);
  
  // State for explanation display
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [userAnswered, setUserAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [stimulus, setStimulus] = useState("");
  const [questionStem, setQuestionStem] = useState("");
  const [questionPrompt, setQuestionPrompt] = useState("");

  // API function to get a new question
  const getNewQuestion = async () => {
    try {
      setLoading(true);
      
      // First request: Get the list of questions
      const questionListResponse = await axios.post(
        'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions',
        JSON.stringify({
          "asmtEventId": 100,
          "test": 1,
          // "domain": "INI,CAS,EOI,SEC"
          "domain": "H, P, Q, S"
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            // You may need to handle authentication/cookies here
          },
          maxBodyLength: Infinity
        }
      );

      // Get the questions list
      const questionList = questionListResponse.data;
      
      if (questionList.length === 0) {
        console.log("No questions available.");
        setLoading(false);
        return;
      }
      
      // Get the question at current index
      const externalId = questionList[questionIndex].external_id;
      setDifficulty(questionList[questionIndex].difficulty || "Standard");
      
      // Second request: Get the full question details using external_id
      const questionDetailResponse = await axios.post(
        'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
        JSON.stringify({ "external_id": externalId }),
        {
          headers: {
            'Content-Type': 'application/json',
            // You may need to handle authentication/cookies here
          },
          maxBodyLength: Infinity
        }
      );

      // Populate UI with question details
      const questionData = questionDetailResponse.data;
      setStimulus(questionData.stimulus || "");
      
      // Split the question into main content and prompt
      const fullQuestion = questionData.stem || "";
      const splitPoint = fullQuestion.lastIndexOf("<br>");
      
      if (splitPoint !== -1 && splitPoint > fullQuestion.length * 0.6) {
        setQuestionStem(fullQuestion.substring(0, splitPoint));
        setQuestionPrompt(fullQuestion.substring(splitPoint + 4));
      } else {
        // If no suitable split point, use the whole question as the stem
        setQuestionStem(fullQuestion);
        setQuestionPrompt("");
      }
      
      // Create new options with proper formatting
      const newOptions = {
        A: { text: questionData.answerOptions[0].content, state: "n" },
        B: { text: questionData.answerOptions[1].content, state: "n" },
        C: { text: questionData.answerOptions[2].content, state: "n" },
        D: { text: questionData.answerOptions[3].content, state: "n" }
      };
      
      setOptions(newOptions);
      setCorrectAnswer(questionData.correct_answer[0]); // Store the correct answer
      setExplanation(questionData.rationale || "Explanation not available");
      
      // Format the question for the app's state management
      const formattedQuestion = {
        id: externalId,
        question: questionData.stem || "",
        stimulus: questionData.stimulus || "",
        options: {
          A: questionData.answerOptions[0].content,
          B: questionData.answerOptions[1].content,
          C: questionData.answerOptions[2].content,
          D: questionData.answerOptions[3].content
        },
        correctAnswer: questionData.correct_answer[0] as Answers,
        explanation: questionData.rationale || "Explanation not available"
      };
      
      setRandomQuestion(formattedQuestion);
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching question:", error);
      setLoading(false);
    }
  };

  // Load API questions when switching to API mode or changing question index
  useEffect(() => {
    if (useApiProblems) {
      // Reset UI states
      setShowExplanation(false);
      setUserAnswered(false);
      setSelectedAnswer(null);
      setMarkedForReview(false);
      
      // Get a new question from the API
      getNewQuestion();
    }
  }, [questionIndex, useApiProblems]);

  // Reset selected answer when changing questions
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  const handleOpenCalcModal = useCalcOptionModalStore((state) => state.openModal);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setUserAnswered(true);
    
    if (useApiProblems) {
      // Mark the selected answer
      const newOptions = {...options};
      
      // Check if the selected answer is correct
      const isCorrect = selectedAnswer === correctAnswer;
      
      // Mark selected answer as correct or incorrect
      newOptions[selectedAnswer].state = isCorrect ? "c" : "i";
      
      // If incorrect, mark the correct answer
      if (!isCorrect) {
        newOptions[correctAnswer].state = "c";
      }
      
      setOptions(newOptions);
      
      // Update streak and correct count
      if (isCorrect) {
        const newCorrectCount = correctCount + 1;
        const newStreak = streak + 1;
        setCorrectCount(newCorrectCount);
        setStreak(newStreak);
        Cookies.set('correctCount', newCorrectCount.toString());
        Cookies.set('streak', newStreak.toString());
      } else {
        setStreak(0);
        Cookies.set('streak', '0');
      }
      
      // Set answer correct state for the app
      setIsAnswerCorrect(isCorrect ? true : false);
      
      // Show explanation - only after submitting
      setShowExplanation(true);
    } else if (useCustomMathProblems && currentProblem) {
      // Handle custom math problems
      const newOptions = {...options};
      
      // Check if the selected answer is correct
      const isCorrect = selectedAnswer === correctAnswer;
      
      // Mark selected answer as correct or incorrect
      newOptions[selectedAnswer].state = isCorrect ? "c" : "i";
      
      // If incorrect, mark the correct answer
      if (!isCorrect) {
        newOptions[correctAnswer].state = "c";
      }
      
      setOptions(newOptions);
      
      // Set answer correct state for the app
      setIsAnswerCorrect(isCorrect);
      
      // Show explanation - only after submitting
      setShowExplanation(true);
    } else {
      // Use original application logic
      onAnswerSubmit(selectedAnswer);
      setShowExplanation(true); // Show explanation for original app questions too
    }
  };

  const moveToNextQuestion = () => {
    // Reset UI states
    setShowExplanation(false);
    setUserAnswered(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(false);
    setMarkedForReview(false);
    
    if (useApiProblems) {
      // Update question index and cookie
      const newIndex = questionIndex + 1;
      setQuestionIndex(newIndex);
      Cookies.set('questionIndex', newIndex.toString());
      
      // Reset options state
      const resetOptions = {...options};
      Object.keys(resetOptions).forEach(key => {
        resetOptions[key].state = "n";
      });
      setOptions(resetOptions);
    } else {
      // Handle other question types (custom or app questions)
      // Reset options state
      const resetOptions = {...options};
      Object.keys(resetOptions).forEach(key => {
        resetOptions[key].state = "n";
      });
      setOptions(resetOptions);
    }
  };

  const toggleQuestionSource = () => {
    if (!useApiProblems) {
      setUseCustomMathProblems(false);
      setUseApiProblems(true);
    } else {
      setUseApiProblems(false);
      setUseCustomMathProblems(false);
    }
    
    setShowExplanation(false);
    setUserAnswered(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(false);
    setMarkedForReview(false);
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(!markedForReview);
  };

  if (loading && useApiProblems) {
    return <div className="flex justify-center items-center h-64">Loading questions from API...</div>;
  }

  if (!randomQuestion && !useApiProblems && !useCustomMathProblems) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start">
      {/* Top toolbar */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <button onClick={handleOpenCalcModal} className="p-2 hover:bg-gray-200 rounded">
            <CalculatorIcon size={20} />
          </button>
          <QuestionSharedUI
            crossOffMode={crossOffMode}
            setCrossOffMode={setCrossOffMode}
          />
        </div>
        <button 
          onClick={toggleQuestionSource}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          {useApiProblems ? "Use App Questions" : "Use API Questions"}
        </button>
      </div>

      {/* Main content area with two-column layout */}
      <div className="w-full flex flex-row">
        {/* Left column - question content */}
        <div className="w-3/5 p-6 border-r border-gray-300 min-h-screen">
          {useApiProblems ? (
            <>
              <div className="mb-4 text-sm font-semibold flex justify-between">
                <span>
                  Difficulty: {
                    difficulty === "M" ? "Medium" : 
                    difficulty === "E" ? "Easy" : 
                    difficulty === "H" ? "Hard" : difficulty || "Standard"
                  }
                </span>
                <span>
                  Score: {correctCount}/{userAnswered ? questionIndex + 1 : questionIndex} correct
                </span>
              </div>
              
              {/* Stimulus section */}
              {stimulus && (
                <div 
                  className="mb-5 text-lg question" 
                  dangerouslySetInnerHTML={{__html: stimulus}}
                />
              )}
              
              {/* Question stem */}
              <div 
                className="mb-5 text-lg question" 
                dangerouslySetInnerHTML={{__html: questionStem || ""}}
              />
              
              {/* Explanation appears below the question after submission */}
              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-bold mb-2 text-blue-700">Explanation:</h3>
                  <div dangerouslySetInnerHTML={{__html: explanation}} />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Original App Question Format */}
              <p className="mb-5 text-lg">
                {parseContent(randomQuestion?.question || "")}
              </p>
              
              {/* Explanation appears below the question after submission */}
              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-bold mb-2 text-blue-700">Explanation:</h3>
                  <div dangerouslySetInnerHTML={{__html: randomQuestion?.explanation || "No explanation available."}} />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Right column - question prompt and answers */}
        <div className="w-2/5 p-6">
          {/* Question counter and Mark for Review button */}
          <div className={`mb-4 p-3 rounded-md flex justify-between items-center ${markedForReview ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <span className="font-bold">Question #{questionIndex + 1}</span>
            <span className="font-medium">Streak: {streak}</span>
            <button 
              onClick={toggleMarkForReview}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${markedForReview ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <BookmarkIcon size={16} />
              <span>{markedForReview ? 'Marked' : 'Mark for Review'}</span>
            </button>
          </div>
          
          {/* Question prompt (last part of the question) */}
          {useApiProblems ? (
            <div 
              className="mb-6 text-lg font-semibold question" 
              dangerouslySetInnerHTML={{__html: questionPrompt || ""}}
            />
          ) : null}
          
          <div className="mb-3 font-semibold">Choose 1 answer:</div>
          
          {/* Answer choices */}
          <div className="space-y-3 mb-6">
            {useApiProblems ? (
              // API-based question answers
              Object.entries(options).map(([key, option]) => (
                <button
                  key={key}
                  onClick={() => !userAnswered && setSelectedAnswer(key as Answers)}
                  className={`w-full border-2 rounded p-3 text-left flex flex-row items-start 
                    ${!userAnswered && selectedAnswer === key ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} 
                    ${option.state === 'c' ? 'bg-green-200 border-green-500' : ''} 
                    ${option.state === 'i' ? 'bg-red-200 border-red-500' : ''}`}
                  disabled={userAnswered}
                >
                  <span className="mr-3 font-bold">{key}.</span>
                  <span dangerouslySetInnerHTML={{__html: option.text}} />
                </button>
              ))
            ) : (
              // Original app answers
              <MultipleChoice 
                crossOffMode={crossOffMode}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={!userAnswered ? setSelectedAnswer : () => {}}
              />
            )}
          </div>
          
          {/* Submit/Next button */}
          {!userAnswered ? (
            <button
              onClick={handleSubmit}
              className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 font-medium"
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={moveToNextQuestion}
              className="w-full mt-4 px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
      
      <CalcOption />
    </div>
  );
};

export default MathQuestion;