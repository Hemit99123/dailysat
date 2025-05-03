// components/ReadingQuestion.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore } from "@/store/questions";
import Image from "next/image";
import { QuestionsProps } from "@/types/sat-platform/questions";
import { BookmarkIcon } from "lucide-react";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";
import { Answers } from "@/types/sat-platform/answer";
import Cookies from "js-cookie";
import axios from "axios";

const ReadingQuestion: React.FC<QuestionsProps> = ({ onAnswerSubmit }) => {
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const setIsAnswerCorrect = useAnswerCorrectStore((state) => state.setIsAnswerCorrect);
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion);
  
  const [mode, setMode] = useState<"highlight" | "clear" | null>(null);
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [userAnswered, setUserAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionCounter, setQuestionCounter] = useState(
    parseInt(Cookies.get('readingQuestionIndex') || '1', 10)
  );
  
  // API-specific states
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(
    parseInt(Cookies.get('readingQuestionIndex') || '0', 10)
  );
  const [correctCount, setCorrectCount] = useState(
    parseInt(Cookies.get('readingCorrectCount') || '0', 10)
  );
  const [streak, setStreak] = useState(
    parseInt(Cookies.get('readingStreak') || '0', 10)
  );
  const [questionList, setQuestionList] = useState([]);
  const [options, setOptions] = useState({
    A: { text: "Option A", state: "n" },
    B: { text: "Option B", state: "n" },
    C: { text: "Option C", state: "n" },
    D: { text: "Option D", state: "n" }
  });
  const [correctAnswer, setCorrectAnswer] = useState<Answers | null>(null);
  const [explanation, setExplanation] = useState("");
  const [useApiMode, setUseApiMode] = useState(true);
  
  const textRef = useRef<HTMLDivElement | null>(null);
  
  // Fetch all questions from the API (only once)
  useEffect(() => {
    if (useApiMode) {
      fetchQuestionsList();
    }
  }, [useApiMode]);
  
  // Fetch a specific question when the index changes
  useEffect(() => {
    if (useApiMode && questionList.length > 0) {
      fetchQuestionDetails();
    }
  }, [questionIndex, questionList]);
  
  // Reset selected answer when changing questions
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
      setMode(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  // Fetch the list of questions from the API
  const fetchQuestionsList = async () => {
    try {
      setLoading(true);
      
      const questionListResponse = await axios.post(
        'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions',
        JSON.stringify({
          "asmtEventId": 100,
          "test": 1,
          "domain": "INI,CAS,EOI,SEC" // Reading comprehension domains
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          maxBodyLength: Infinity
        }
      );

      const fetchedQuestionList = questionListResponse.data;
      
      if (fetchedQuestionList.length === 0) {
        console.log("No questions available.");
        setLoading(false);
        return;
      }
      
      // Shuffle the questions for randomization
      const shuffledQuestions = shuffleArray([...fetchedQuestionList]);
      setQuestionList(shuffledQuestions);
      
    } catch (error) {
      console.error("Error fetching questions list:", error);
      setLoading(false);
    }
  };
  
  // Shuffle array function for random questions
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch details for the current question
  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      
      if (questionList.length === 0 || questionIndex >= questionList.length) {
        console.log("No questions available or index out of bounds.");
        setLoading(false);
        return;
      }
      
      // Get the external ID for the current question
      const externalId = questionList[questionIndex].external_id;
      
      // Get the full question details
      const questionDetailResponse = await axios.post(
        'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
        JSON.stringify({ "external_id": externalId }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          maxBodyLength: Infinity
        }
      );

      const questionData = questionDetailResponse.data;
      
      // Create options with proper formatting
      const newOptions = {
        A: { text: questionData.answerOptions[0].content, state: "n" },
        B: { text: questionData.answerOptions[1].content, state: "n" },
        C: { text: questionData.answerOptions[2].content, state: "n" },
        D: { text: questionData.answerOptions[3].content, state: "n" }
      };
      
      setOptions(newOptions);
      setCorrectAnswer(questionData.correct_answer[0] as Answers);
      setExplanation(questionData.rationale || "Explanation not available");
      
      // Format the question for the app's state management
      const formattedQuestion = {
        id: externalId,
        question: questionData.stimulus ? `${questionData.stimulus}<br><br>${questionData.stem}` : questionData.stem,
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
      console.error("Error fetching question details:", error);
      setLoading(false);
    }
  };

  const toggleMode = (newMode: "highlight" | "clear") => {
    setMode((prevMode) => (prevMode === newMode ? null : newMode));
  };

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
        <div dangerouslySetInnerHTML={{ __html: randomQuestion?.question || "" }} />
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
      setUserAnswered(true);
      
      if (useApiMode && correctAnswer) {
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
          Cookies.set('readingCorrectCount', newCorrectCount.toString());
          Cookies.set('readingStreak', newStreak.toString());
        } else {
          setStreak(0);
          Cookies.set('readingStreak', '0');
        }
        
        setIsAnswerCorrect(isCorrect);
      } else {
        // Original app logic
        onAnswerSubmit(selectedAnswer);
      }
      
      setShowExplanation(true);
    }
  };

  const moveToNextQuestion = () => {
    // Reset UI states
    setShowExplanation(false);
    setUserAnswered(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(false);
    setMarkedForReview(false);
    
    // Clear highlights
    if (textRef.current) {
      const spans = textRef.current.querySelectorAll("span");
      spans.forEach((span) => {
        if (span.style.backgroundColor === "yellow") {
          const textNode = document.createTextNode(span.textContent || "");
          span.replaceWith(textNode);
        }
      });
    }
    
    if (useApiMode) {
      // Get a new random index from the shuffled list
      let newIndex = Math.floor(Math.random() * questionList.length);
      
      // Make sure it's not the same as the current one
      while (newIndex === questionIndex && questionList.length > 1) {
        newIndex = Math.floor(Math.random() * questionList.length);
      }
      
      // Update question index and counter
      setQuestionIndex(newIndex);
      const newCounter = questionCounter + 1;
      setQuestionCounter(newCounter);
      
      // Save to cookies
      Cookies.set('readingQuestionIndex', newIndex.toString());
      Cookies.set('readingQuestionCounter', newCounter.toString());
      
      // Reset options state
      const resetOptions = {...options};
      Object.keys(resetOptions).forEach(key => {
        resetOptions[key].state = "n";
      });
      setOptions(resetOptions);
    } else {
      // Original app functionality
      setQuestionCounter(prev => prev + 1);
    }
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(!markedForReview);
  };

  const toggleApiMode = () => {
    setUseApiMode(!useApiMode);
    
    // Reset states when switching modes
    setShowExplanation(false);
    setUserAnswered(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(false);
    setMarkedForReview(false);
    
    // Clear highlights
    if (textRef.current) {
      const spans = textRef.current.querySelectorAll("span");
      spans.forEach((span) => {
        if (span.style.backgroundColor === "yellow") {
          const textNode = document.createTextNode(span.textContent || "");
          span.replaceWith(textNode);
        }
      });
    }
  };

  if (loading && useApiMode) {
    return <div className="flex justify-center items-center h-64">Loading reading questions from API...</div>;
  }

  if (!randomQuestion && !(useApiMode && loading)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start">
      {/* Top toolbar */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleMode("highlight")}
            className={`p-2 hover:bg-gray-200 rounded ${
              mode === "highlight" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <Image
              src={
                mode !== "highlight"
                  ? "/icons/highlighter.png"
                  : "/icons/full.png"
              }
              alt="Toggle highlight mode"
              className="w-5 h-5"
              width={500}
              height={500}
            />
          </button>
          <button
            onClick={() => toggleMode("clear")}
            className={`p-2 hover:bg-gray-200 rounded ${
              mode === "clear" ? "bg-red-500 text-white" : ""
            }`}
          >
            <Image
              src={mode !== "clear" ? "/icons/eraser.png" : "/icons/colored.png"}
              alt="Toggle clear highlight mode"
              className="w-5 h-5"
              width={500}
              height={500}
            />
          </button>
          <QuestionSharedUI
            crossOffMode={crossOffMode}
            setCrossOffMode={setCrossOffMode}
          />
        </div>
        <button 
          onClick={toggleApiMode}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          {useApiMode ? "Use App Questions" : "Use API Questions"}
        </button>
      </div>

      {/* Main content area with two-column layout */}
      <div className="w-full flex flex-row">
        {/* Left column - question content */}
        <div className="w-3/5 p-6 border-r border-gray-300 min-h-screen">
          {useApiMode && (
            <div className="mb-4 text-sm font-semibold flex justify-between">
              <span>Reading Comprehension</span>
              <span>Score: {correctCount}/{userAnswered ? questionCounter : questionCounter - 1} correct</span>
            </div>
          )}
          
          {renderHighlightedText()}
          
          {/* Explanation appears below the question after submission */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-bold mb-2 text-blue-700">Explanation:</h3>
              <div dangerouslySetInnerHTML={{__html: useApiMode ? explanation : (randomQuestion?.explanation || "No explanation available.")}} />
            </div>
          )}
        </div>
        
        {/* Right column - question prompt and answers */}
        <div className="w-2/5 p-6">
          {/* Question counter and Mark for Review button */}
          <div className={`mb-4 p-3 rounded-md flex justify-between items-center ${markedForReview ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <span className="font-bold">Question #{questionCounter}</span>
            {useApiMode && <span className="font-medium">Streak: {streak}</span>}
            <button 
              onClick={toggleMarkForReview}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${markedForReview ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <BookmarkIcon size={16} />
              <span>{markedForReview ? 'Marked' : 'Mark for Review'}</span>
            </button>
          </div>

          <div className="mb-3 font-semibold">Choose 1 answer:</div>
          
          {/* Answer choices */}
          <div className="space-y-3 mb-6">
            {useApiMode ? (
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
    </div>
  );
};

export default ReadingQuestion;