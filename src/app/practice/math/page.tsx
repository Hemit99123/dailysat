"use client";
import { useEffect, useState, useRef } from "react";
import { TopicSidebar } from "@/components/practice/TopicSidebar";
import { QuestionContent } from "@/components/practice/QuestionContent";
import ScoreAndProgress from "@/components/practice/ScoreAndProgress";
import { DesmosCalculator } from "@/components/practice/DesmosCalculator";
import { usePracticeSession, Question, QuestionHistory } from "@/hooks/usePracticeSession";

declare global {
  interface Window {
    katex: any;
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}

export default function MathPracticePage() {
  const subject: "Math" = "Math";
  const {
    difficulty, setDifficulty, selectedDomain, setSelectedDomain, mathDomains,
    currentQuestion, setCurrentQuestion, isLoading,
    correctCount, setCorrectCount, wrongCount, setWrongCount,
    currentStreak, setCurrentStreak, maxStreak, setMaxStreak,
    mathCorrect, setMathCorrect, mathWrong, setMathWrong, predictedMathScore,
    questionHistory, setQuestionHistory, currentHistoryIndex, setCurrentHistoryIndex,
    showNext,
  } = usePracticeSession();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showDesmos, setShowDesmos] = useState(false);
  const questionContentRef = useRef<HTMLDivElement>(null);

  const domainDisplayMapping = {
    "Algebra": "Algebra", "Advanced Math": "Advanced Math",
    "Problem-Solving and Data Analysis": "Problem-Solving and Data Analysis",
    "Geometry and Trigonometry": "Geometry and Trigonometry",
  };

  const resetQuestionStates = (preserveAnswer = false) => {
  if (!preserveAnswer) setSelectedAnswer(null);
  setIsCorrect(null);
  setShowExplanation(false);
  setIsSubmitted(false);
};


  useEffect(() => {
  // Don't reset selectedAnswer if viewing an answered question from history
  resetQuestionStates(currentHistoryIndex !== null && questionHistory[currentHistoryIndex]?.isAnswered);
}, [currentQuestion]);


  useEffect(() => {
    if (!document.head.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      document.head.appendChild(fontAwesomeLink);
    }
    if (!document.head.querySelector('link[href*="katex"]')) {
        const katexLink = document.createElement('link');
        katexLink.rel = 'stylesheet';
        katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(katexLink);
    }
  }, []);

  useEffect(() => {
    const renderMath = () => {
      if (questionContentRef.current && typeof window.renderMathInElement !== 'undefined') {
        window.renderMathInElement(questionContentRef.current, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
          throwOnError: false,
          output: 'html',
          strict: false,
          trust: true,
          macros: {
            "\\R": "\\mathbb{R}",
            "\\N": "\\mathbb{N}",
            "\\Z": "\\mathbb{Z}"
          }
        });
      }
    };
    
    const loadKatex = async () => {
      if (typeof window === 'undefined') return;
      
      if (!document.getElementById('katex-script')) {
        const script = document.createElement('script');
        script.id = 'katex-script';
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.async = true;
        
        const autoRenderScript = document.createElement('script');
        autoRenderScript.id = 'katex-autorender-script';
        autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
        autoRenderScript.async = true;
        
        await new Promise((resolve) => {
          script.onload = resolve;
          document.body.appendChild(script);
        });
        
        await new Promise((resolve) => {
          autoRenderScript.onload = resolve;
          document.body.appendChild(autoRenderScript);
        });
      }
      
      renderMath();
    };
    
    loadKatex();
  }, [currentQuestion, isSubmitted, selectedAnswer]);

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setMathCorrect(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setWrongCount(prev => prev + 1);
      setMathWrong(prev => prev + 1);
      setCurrentStreak(0);
    }

    setQuestionHistory(prev => {
      const foundIndex = prev.findIndex(item => item.question.id === currentQuestion.id);
      if (foundIndex !== -1) {
        return prev.map((item, index) => 
          index === foundIndex ? {
            ...item,
            userAnswer: selectedAnswer,
            isCorrect: correct,
            isAnswered: true,
            isMarkedForLater: item.isMarkedForLater
          } : item
        );
      } else {
        return [...prev, {
          id: prev.length + 1,
          question: currentQuestion,
          userAnswer: selectedAnswer,
          isCorrect: correct,
          isAnswered: true,
          isMarkedForLater: false
        }];
      }
    });
  };

  const handleMarkForLater = () => {
    if (!currentQuestion) return;

    setQuestionHistory(prev => {
      const foundIndex = prev.findIndex(item => item.question.id === currentQuestion.id);
      
      if (foundIndex !== -1) {
        return prev.map((item, index) => {
          if (index === foundIndex) {
            const newMarkedStatus = !item.isMarkedForLater;
            return {
              ...item,
              isMarkedForLater: newMarkedStatus
            };
          }
          return item;
        });
      } else {
        const newHistoryItem: QuestionHistory = {
          id: prev.length + 1,
          question: currentQuestion,
          userAnswer: null,
          isCorrect: null,
          isMarkedForLater: true,
          isAnswered: false
        };
        return [...prev, newHistoryItem];
      }
    });
  };

  const handleProgressBoxClick = (index: number) => {
    const historyItem = questionHistory[index];
    setCurrentHistoryIndex(index);
    setCurrentQuestion(historyItem.question);
    setSelectedAnswer(historyItem.userAnswer);
    setIsCorrect(historyItem.isCorrect);
    setIsSubmitted(historyItem.isAnswered);
    setShowExplanation(historyItem.isAnswered);
  };

  const handleNext = () => {
    if (currentHistoryIndex !== null) {
      setCurrentHistoryIndex(null);
    }
    showNext();
    resetQuestionStates();
  };

  const currentQuestionStatus = questionHistory.find(item => item.question.id === currentQuestion?.id);
  const isViewingAnsweredHistory = currentHistoryIndex !== null && questionHistory[currentHistoryIndex]?.isAnswered;

  return (
    <div style={{ display: "flex", gap: "24px", padding: "20px" }}>
      <TopicSidebar
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        currentDomainNames={mathDomains}
        domainDisplayMapping={domainDisplayMapping}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        subject={subject}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: "24px" }}>
        <div ref={questionContentRef} style={{ flex: 1, backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "black" }}>
          <QuestionContent
            isMarked={currentQuestionStatus?.isMarkedForLater || false}
            isLoading={isLoading}
            currentQuestion={currentQuestion}
            subject={subject}
            selectedDomain={selectedDomain}
            showDesmos={showDesmos}
            setShowDesmos={setShowDesmos}
            handleMarkForLater={handleMarkForLater}
            currentQuestionStatus={currentQuestionStatus}
            selectedAnswer={selectedAnswer}
            isSubmitted={isSubmitted}
            isViewingAnsweredHistory={isViewingAnsweredHistory}
            handleAnswerSelect={setSelectedAnswer}
            isCorrect={isCorrect}
            handleSubmit={handleSubmit}
            showNext={handleNext}
            showExplanation={showExplanation}
          />
        </div>

        <div style={{ width: "250px" }}>
          <ScoreAndProgress
            correctCount={correctCount}
            wrongCount={wrongCount}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
            predictedScore={predictedMathScore}
            questionHistory={questionHistory}
            onProgressBoxClick={handleProgressBoxClick}
            currentQuestion={currentQuestion}
          />
        </div>
      </div>

      {showDesmos && (
        <DesmosCalculator showDesmos={showDesmos} setShowDesmos={setShowDesmos} />
      )}
    </div>
  );
}