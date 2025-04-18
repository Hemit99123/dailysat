// import React, { useState, useEffect } from "react";
// import { Answers } from "@/types/sat-platform/answer";
// import { useAnswerStore, useAnswerCorrectStore, useQuestionStore } from "@/store/questions";
// import { CalculatorIcon } from "lucide-react";
// import { useCalcOptionModalStore } from "@/store/modals";
// import CalcOption from "../../Modals/CalcOption";
// import { parseContent } from "@/lib/latex";
// import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions"; // Import the shared UI component
// import MultipleChoice from "../SharedQuestionUI/MultipleChoice";

// const MathQuestion: React.FC<{ onAnswerSubmit: (answer: Answers) => void }> = ({
//   onAnswerSubmit,
// }) => {
//   const randomQuestion = useQuestionStore((state) => state.randomQuestion);
//   const selectedAnswer = useAnswerStore((state) => state.answer);
//   const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
//   const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  
//   // Remove null from the state type
//   const [crossOffMode, setCrossOffMode] = useState(false);
  
//   useEffect(() => {
//     if (isAnswerCorrect) {
//       setSelectedAnswer(null);
//     }
//   }, [isAnswerCorrect, setSelectedAnswer]);

//   const handleSubmit = () => {
//     if (!selectedAnswer) return;
//     onAnswerSubmit(selectedAnswer);
//     setSelectedAnswer(null);
//   };

//   const handleOpenCalcModal = useCalcOptionModalStore((state) => state.openModal);

//   if (!randomQuestion) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col items-start px-8 -mt-6">
//       <div className="flex tems-center mb-2 space-x-4">
//         <button onClick={handleOpenCalcModal}>
//           <CalculatorIcon />
//         </button>
//         <div className="mt-6">
//           <QuestionSharedUI
//             crossOffMode={crossOffMode}
//             setCrossOffMode={setCrossOffMode}
//           />
//         </div>

//       </div>

//       {/* Question Text with LaTeX rendering */}
//       <p className="mb-5 text-xl relative">
//         {parseContent(randomQuestion.question || "")}
//       </p>

//       <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
      
//       <div className="w-full">
//         <MultipleChoice 
//           crossOffMode={crossOffMode}
//           selectedAnswer={selectedAnswer}
//           setSelectedAnswer={setSelectedAnswer}
//         />
//       </div>


//       <button
//         onClick={handleSubmit}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         disabled={!selectedAnswer}
//       >
//         Submit Answer
//       </button>
//       <CalcOption />
//     </div>
//   );
// };

// export default MathQuestion;

import React, { useState, useEffect } from "react";
import { Answers } from "@/types/sat-platform/answer";
import { useAnswerStore, useAnswerCorrectStore, useQuestionStore } from "@/store/questions";
import { CalculatorIcon } from "lucide-react";
import { useCalcOptionModalStore } from "@/store/modals";
import CalcOption from "../../Modals/CalcOption";
import { parseContent } from "@/lib/latex";
import QuestionSharedUI from "../SharedQuestionUI/QuestionOptions";
import MultipleChoice from "../SharedQuestionUI/MultipleChoice";
import Cookies from "js-cookie";

// Import the JSON file with math problems
import mathProblemsData from "./cb-digital-questions.json";

// Define interfaces for proper typing
interface MathProblem {
  updateDate?: number;
  pPcc?: string;
  questionId?: string;
  skill_cd?: string;
  score_band_range_cd?: number;
  uId?: string;
  skill_desc?: string;
  createDate?: number;
  program?: string;
  primary_class_cd_desc?: string;
  ibn?: null | string;
  external_id?: string;
  primary_class_cd?: string;
  difficulty?: string;
  module?: string;
  content: {
    keys?: string[];
    rationale?: string;
    origin?: string;
    stem?: string;
    externalid?: string;
    templateid?: string;
    vaultid?: string;
    type?: string;
    answerOptions?: Array<{
      content: string;
      id: string;
    }>;
    correct_answer?: string[];
  };
}

interface MathProblemsData {
  [key: string]: MathProblem;
}

const MathQuestion: React.FC<{ onAnswerSubmit: (answer: Answers) => void }> = ({
  onAnswerSubmit,
}) => {
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion);
  const selectedAnswer = useAnswerStore((state) => state.answer);
  const setSelectedAnswer = useAnswerStore((state) => state.setAnswer);
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
  const setIsAnswerCorrect = useAnswerCorrectStore((state) => state.setIsAnswerCorrect);
  
  const [crossOffMode, setCrossOffMode] = useState(false);
  const [useCustomMathProblems, setUseCustomMathProblems] = useState(false);
  
  // Custom math problems state
  const [mathProblems, setMathProblems] = useState<MathProblemsData>({});
  const [validProblemKeys, setValidProblemKeys] = useState<string[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(parseInt(Cookies.get('mathProblemIndex') || '0', 10));
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{[key: string]: {text: string, state: string}}>({
    A: { text: "Option A", state: "n" },
    B: { text: "Option B", state: "n" },
    C: { text: "Option C", state: "n" },
    D: { text: "Option D", state: "n" }
  });
  
  // State for explanation display
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [userAnswered, setUserAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  // Load math problems from JSON file and filter only valid problems
  useEffect(() => {
    try {
      // Set the math problems from the imported JSON
      setMathProblems(mathProblemsData as MathProblemsData);
      
      // Extract the keys and filter for valid questions only
      const keys = Object.keys(mathProblemsData);
      const validKeys = keys.filter(key => {
        const problem = mathProblemsData[key];
        
        // Check if problem has valid content structure
        return problem && 
               problem.content && 
               problem.content.stem && 
               ((problem.content.answerOptions && problem.content.answerOptions.length > 0) || 
                (problem.content.keys && problem.content.keys.length > 0)) &&
               (problem.content.correct_answer || problem.content.keys);
      });
      
      setValidProblemKeys(validKeys);
      setLoading(false);
    } catch (error) {
      console.error("Error loading math problems:", error);
      setLoading(false);
    }
  }, []);

  // Set current problem when index changes or when toggling to custom problems
  useEffect(() => {
    if (useCustomMathProblems && validProblemKeys.length > 0) {
      // Reset UI states when changing problems
      setShowExplanation(false);
      setUserAnswered(false);
      
      const key = validProblemKeys[currentProblemIndex % validProblemKeys.length];
      const problem = mathProblems[key];
      setCurrentProblem(problem);
      
      if (problem) {
        // Set explanation for later use
        setExplanation(problem.content.rationale || "Explanation not provided.");
        
        // Generate options for multiple choice if there are answerOptions
        if (problem.content.answerOptions && problem.content.answerOptions.length > 0) {
          const newOptions: {[key: string]: {text: string, state: string}} = {};
          const optionLetters = ['A', 'B', 'C', 'D'];
          
          problem.content.answerOptions.forEach((option, index) => {
            if (index < optionLetters.length) {
              const letter = optionLetters[index];
              newOptions[letter] = { 
                text: option.content, 
                state: "n" 
              };
            }
          });
          
          // Fill remaining options if there are less than 4
          for (let i = problem.content.answerOptions.length; i < 4; i++) {
            const letter = optionLetters[i];
            newOptions[letter] = { 
              text: `Option ${letter}`, 
              state: "n" 
            };
          }
          
          setOptions(newOptions);
          
          // Get correct answer and store it
          const correctAnswerLetter = getCorrectAnswerLetter(problem);
          setCorrectAnswer(correctAnswerLetter);
          
          // Format the question for the existing app's state management
          const formattedQuestion = {
            id: problem.external_id || problem.questionId || key,
            question: problem.content.stem || "",
            stimulus: "",
            options: {
              A: newOptions.A.text,
              B: newOptions.B.text,
              C: newOptions.C.text,
              D: newOptions.D.text
            },
            correctAnswer: correctAnswerLetter as Answers,
            explanation: problem.content.rationale || "Explanation not provided."
          };
          
          setRandomQuestion(formattedQuestion);
        } else if (problem.content.keys && problem.content.keys.length > 0) {
          // For grid-in questions or questions with keys
          const correctAns = problem.content.keys[0];
          setCorrectAnswer("A");
          
          const formattedQuestion = {
            id: problem.external_id || problem.questionId || key,
            question: problem.content.stem || "",
            stimulus: "",
            options: {
              A: correctAns,
              B: generateIncorrectAnswer(correctAns),
              C: generateIncorrectAnswer(correctAns),
              D: generateIncorrectAnswer(correctAns)
            },
            correctAnswer: "A" as Answers,
            explanation: problem.content.rationale || "Explanation not provided."
          };
          
          setRandomQuestion(formattedQuestion);
          setOptions({
            A: { text: correctAns, state: "n" },
            B: { text: generateIncorrectAnswer(correctAns), state: "n" },
            C: { text: generateIncorrectAnswer(correctAns), state: "n" },
            D: { text: generateIncorrectAnswer(correctAns), state: "n" }
          });
        }
      }
    }
  }, [currentProblemIndex, useCustomMathProblems, validProblemKeys, mathProblems, setRandomQuestion]);

  // Helper function to determine the correct answer letter
  const getCorrectAnswerLetter = (problem: MathProblem): string => {
    if (!problem.content.answerOptions || problem.content.answerOptions.length === 0) {
      return "A"; // Default to A for grid-in questions
    }
    
    // Find which option matches the correct answer
    if (problem.content.correct_answer && problem.content.correct_answer.length > 0) {
      const correctAnswerId = problem.content.correct_answer[0];
      const correctOptionIndex = problem.content.answerOptions.findIndex(
        option => option.id === correctAnswerId
      );
      
      return ['A', 'B', 'C', 'D'][correctOptionIndex >= 0 ? correctOptionIndex : 0] || 'A';
    }
    
    return 'A'; // Default fallback
  };

  // Reset selected answer when changing questions
  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
    }
  }, [isAnswerCorrect, setSelectedAnswer]);

  // Generate a slightly different number for incorrect answers
  const generateIncorrectAnswer = (correctAnswer: string) => {
    // Parse the correct answer as a number if possible
    let numAnswer = parseFloat(correctAnswer);
    if (!isNaN(numAnswer)) {
      // Generate a number that's slightly different
      return (numAnswer + (Math.random() * 2 - 1)).toFixed(4);
    } else if (correctAnswer.includes("/")) {
      // For fractions like "3/17"
      return correctAnswer.split("/")[0] + "/" + (parseInt(correctAnswer.split("/")[1]) + 1);
    } else {
      // If not a simple number or fraction, just append a character
      return correctAnswer + "*";
    }
  };

  const handleOpenCalcModal = useCalcOptionModalStore((state) => state.openModal);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setUserAnswered(true);
    
    if (useCustomMathProblems && currentProblem) {
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
      
      // Set answer correct state for the app
      setIsAnswerCorrect(isCorrect);
      
      // Show explanation
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
    
    // Move to next question
    const newIndex = currentProblemIndex + 1;
    setCurrentProblemIndex(newIndex);
    Cookies.set('mathProblemIndex', newIndex.toString());
    
    // Reset options state
    const resetOptions = {...options};
    Object.keys(resetOptions).forEach(key => {
      resetOptions[key].state = "n";
    });
    setOptions(resetOptions);
  };

  const toggleQuestionSource = () => {
    setUseCustomMathProblems(!useCustomMathProblems);
    setShowExplanation(false);
    setUserAnswered(false);
    setSelectedAnswer(null);
  };

  if (loading && useCustomMathProblems) {
    return <div className="flex justify-center items-center h-64">Loading custom math problems...</div>;
  }

  if (!randomQuestion && !useCustomMathProblems) {
    return <div>Loading...</div>;
  }

  if (useCustomMathProblems && validProblemKeys.length === 0) {
    return <div className="flex justify-center items-center h-64">No valid math problems found.</div>;
  }

  return (
    <div className="flex flex-col items-start px-8 -mt-6">
      <div className="flex items-center mb-2 space-x-4">
        <button onClick={handleOpenCalcModal}>
          <CalculatorIcon />
        </button>
        <div className="mt-6">
          <QuestionSharedUI
            crossOffMode={crossOffMode}
            setCrossOffMode={setCrossOffMode}
          />
        </div>
        <div className="mt-6 ml-6">
          <button 
            onClick={toggleQuestionSource}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            {useCustomMathProblems ? "Use App Questions" : "Use Custom Math Problems"}
          </button>
        </div>
      </div>

      {useCustomMathProblems && currentProblem ? (
        <>
          <div className="w-full flex justify-between mb-2">
            <span className="text-sm font-semibold">
              Topic: {currentProblem.skill_desc || currentProblem.primary_class_cd_desc || "General Math"}
            </span>
            <span className="text-sm font-semibold">
              Difficulty: {currentProblem.difficulty === "M" ? "Medium" : 
                           currentProblem.difficulty === "E" ? "Easy" : 
                           currentProblem.difficulty === "H" ? "Hard" : currentProblem.difficulty || "Standard"}
            </span>
            <span className="text-sm font-semibold">Question #{currentProblemIndex + 1} of {validProblemKeys.length}</span>
          </div>
          
          {/* Custom Math Problem */}
          <div 
            className="mb-5 text-xl question" 
            dangerouslySetInnerHTML={{__html: currentProblem.content.stem || ""}}
          />
          
          <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
          
          <div className="w-full space-y-3">
            {Object.entries(options).map(([key, option]) => (
              <button
                key={key}
                onClick={() => !userAnswered && setSelectedAnswer(key as Answers)}
                className={`w-full border-2 rounded p-2 text-left flex flex-row items-start 
                  ${!userAnswered && selectedAnswer === key ? 'border-blue-500 bg-blue-100' : 'border-black'} 
                  ${option.state === 'c' ? 'bg-green-200 border-green-500' : ''} 
                  ${option.state === 'i' ? 'bg-red-200 border-red-500' : ''}`}
                disabled={userAnswered}
              >
                <span className="mr-2 font-bold">{key}.</span>
                <span dangerouslySetInnerHTML={{__html: option.text}} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Original App Question Format */}
          <p className="mb-5 text-xl relative">
            {parseContent(randomQuestion?.question || "")}
          </p>

          <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
          
          <div className="w-full">
            <MultipleChoice 
              crossOffMode={crossOffMode}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={!userAnswered ? setSelectedAnswer : () => {}}
            />
          </div>
        </>
      )}

      {/* Explanation section */}
      {showExplanation && (
        <div className="mt-4 p-3 bg-gray-100 rounded w-full">
          <h3 className="font-bold text-lg">
            {isAnswerCorrect ? "Correct! ✓" : "Incorrect ✗"}
          </h3>
          <p className="mt-2">
            {explanation || (randomQuestion?.explanation || "No explanation available.")}
          </p>
        </div>
      )}

      {!userAnswered ? (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={moveToNextQuestion}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Next Question
        </button>
      )}
      <CalcOption />
    </div>
  );
};

export default MathQuestion;