"use client";
import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    katex: any;
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}

const DATA_URL = "https://api.jsonsilo.com/public/942c3c3b-3a0c-4be3-81c2-12029def19f5";

type Question = {
  id: string;
  domain: string;
  visuals: { type: string; svg_content: string };
  question: {
    choices: Record<string, string>;
    question: string;
    paragraph: string | null;
    explanation: string;
    correct_answer: string;
  };
  difficulty: "Easy" | "Medium" | "Hard" | string;
};

type Data = {
  math: Question[];
  english: Question[];
};

type QuestionHistory = {
  id: number;
  question: Question;
  userAnswer: string | null;
  isCorrect: boolean | null;
  isMarkedForLater: boolean;
  isAnswered: boolean;
};

export default function MathPracticePage() {
  const [data, setData] = useState<Data | null>(null);
  const subject: "Math" = "Math";
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [mathDomains, setMathDomains] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchQuestionTrigger, setFetchQuestionTrigger] = useState(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [mathCorrect, setMathCorrect] = useState<number>(0);
  const [mathWrong, setMathWrong] = useState<number>(0);
  const [predictedMathScore, setPredictedMathScore] = useState<number>(200);
  const [isAccuracyExpanded, setIsAccuracyExpanded] = useState<boolean>(false);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const questionHistoryRef = useRef(questionHistory);
  useEffect(() => {
    questionHistoryRef.current = questionHistory;
  }, [questionHistory]);

  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);
  const [showDesmos, setShowDesmos] = useState(false);
  const desmosRef = useRef<HTMLDivElement>(null);
  const [desmosPosition, setDesmosPosition] = useState({ x: 0, y: 0 });
  const [desmosSize, setDesmosSize] = useState({ width: 400, height: 300 });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  const questionContentRef = useRef<HTMLDivElement>(null);

  const domainDisplayMapping = {
    "Algebra": "Algebra", "Advanced Math": "Advanced Math", "Problem-Solving and Data Analysis": "Problem-Solving and Data Analysis", "Geometry and Trigonometry": "Geometry and Trigonometry",
  };

  const totalAttempts = correctCount + wrongCount;
  const correctPercentage = totalAttempts === 0 ? 0 : (correctCount / totalAttempts) * 100;
  const mathTotal = mathCorrect + mathWrong;
  const mathPercentage = mathTotal === 0 ? 0 : (mathCorrect / mathTotal);

  const resetQuestionStates = () => {
    setSelectedAnswer(null); setIsCorrect(null); setShowExplanation(false); setIsSubmitted(false);
  };

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    if (!document.head.querySelector('link[href*="font-awesome"]')) document.head.appendChild(fontAwesomeLink);
    const katexLink = document.createElement('link');
    katexLink.rel = 'stylesheet';
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    if (!document.head.querySelector('link[href*="katex"]')) document.head.appendChild(katexLink);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData: Data = await response.json();
        setData(jsonData);
        const uniqueMathDomains = Array.from(new Set(jsonData.math.map((q) => q.domain)));
        setMathDomains(uniqueMathDomains);
      } catch (error) { console.error("Error fetching initial JSON data:", error); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentHistoryIndex !== null) { setIsLoading(false); return; }
    setIsLoading(true);
    setCurrentQuestion(null);

    const loadQuestion = () => {
        if (!data || data.math.length === 0) {
            setIsLoading(false);
            return;
        }

        let allFilteredQuestions = data.math.filter(q => {
            const matchesDifficulty = difficulty === "All" || q.difficulty === difficulty;
            const matchesDomain = selectedDomain === "All" || q.domain === selectedDomain;
            return matchesDifficulty && matchesDomain;
        });

        const attemptedQuestionIds = new Set(questionHistoryRef.current.filter(item => item.isAnswered).map(item => item.question.id));
        const unattemptedQuestions = allFilteredQuestions.filter(q => !attemptedQuestionIds.has(q.id));

        let newQuestion: Question | null = null;
        if (unattemptedQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * unattemptedQuestions.length);
            newQuestion = unattemptedQuestions[randomIndex];
        } else if (allFilteredQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allFilteredQuestions.length);
            newQuestion = allFilteredQuestions[randomIndex];
        }

        setCurrentQuestion(newQuestion);
        resetQuestionStates();
        setIsLoading(false);
    };

    loadQuestion();
  }, [data, difficulty, selectedDomain, currentHistoryIndex, fetchQuestionTrigger, subject]);


  useEffect(() => {
    const newMathScore = Math.round((mathPercentage * 600) + 200);
    setPredictedMathScore(newMathScore);
  }, [mathPercentage]);

  const handleAnswerSelect = (choice: string) => {
    if (isSubmitted || (currentHistoryIndex !== null && questionHistory[currentHistoryIndex].isAnswered)) return;
    setSelectedAnswer(choice);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true); 

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setMathCorrect((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((maxPrev) => Math.max(maxPrev, newStreak));
        return newStreak;
      });
    } else {
      setWrongCount((prev) => prev + 1);
      setMathWrong((prev) => prev + 1);
      setCurrentStreak(0);
    }

    setQuestionHistory(prev => {
        const historyCopy = [...prev];
        const existingUnansweredIndex = historyCopy.findIndex(
            item => item.question.id === currentQuestion.id && !item.isAnswered
        );

        if (existingUnansweredIndex !== -1) {
            historyCopy[existingUnansweredIndex] = {
                ...historyCopy[existingUnansweredIndex],
                userAnswer: selectedAnswer,
                isCorrect: correct,
                isAnswered: true,
            };
            return historyCopy;
        } else {
            const newHistoryItem: QuestionHistory = {
                id: prev.length + 1,
                question: currentQuestion,
                userAnswer: selectedAnswer,
                isCorrect: correct,
                isMarkedForLater: false,
                isAnswered: true,
            };
            return [...prev, newHistoryItem];
        }
    });
  };

  const showNext = () => {
    setCurrentHistoryIndex(null);
    resetQuestionStates();
    setFetchQuestionTrigger(prev => prev + 1);
  };

  const handleMarkForLater = () => {
    if (!currentQuestion) return;

    setQuestionHistory(prev => {
      let foundIndex = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].question.id === currentQuestion.id) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        return prev.map((item, index) =>
          index === foundIndex ? { ...item, isMarkedForLater: !item.isMarkedForLater } : item
        );
      } else {
        const newHistoryItem: QuestionHistory = {
          id: prev.length + 1,
          question: currentQuestion,
          userAnswer: null,
          isCorrect: null,
          isMarkedForLater: true,
          isAnswered: false,
        };
        return [...prev, newHistoryItem];
      }
    });
  };

  const handleProgressBoxClick = (index: number) => {
    const historyItem = questionHistory[index];
    setCurrentHistoryIndex(index); setCurrentQuestion(historyItem.question); setSelectedAnswer(historyItem.userAnswer);
    setIsCorrect(historyItem.isCorrect); setIsSubmitted(historyItem.isAnswered); setShowExplanation(historyItem.isAnswered);
  };

  const getCurrentQuestionStatus = () => {
    if (!currentQuestion) return null;
    for (let i = questionHistory.length - 1; i >= 0; i--) {
      if (questionHistory[i].question.id === currentQuestion.id) {
        return questionHistory[i];
      }
    }
    return null;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'drag' | 'resize') => {
    if (desmosRef.current) {
      const rect = desmosRef.current.getBoundingClientRect();
      if (type === 'drag') {
        isDragging.current = true; dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        isResizing.current = true; resizeStart.current = { x: e.clientX, y: e.clientY }; initialSize.current = { width: rect.width, height: rect.height };
      }
      e.preventDefault(); document.body.style.userSelect = 'none';
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current && desmosRef.current) {
      setDesmosPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    } else if (isResizing.current && desmosRef.current) {
      const newWidth = Math.max(300, initialSize.current.width + (e.clientX - resizeStart.current.x));
      const newHeight = Math.max(200, initialSize.current.height + (e.clientY - resizeStart.current.y));
      setDesmosSize({ width: newWidth, height: newHeight });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false; isResizing.current = false; document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const getDifficultyEmoji = (diff: string) => ({ "All": "❓", "Easy": "😊", "Medium": "😐", "Hard": "😠" }[diff] || "❓");
  const getDifficultyColor = (diff: string) => ({ "Easy": "#4caf50", "Medium": "#F7DA1D", "Hard": "#f44336" }[diff] || "white");
  const getDifficultyTooltip = (diff: string) => ({ "All": "Any Difficulty", "Easy": "Easy", "Medium": "Medium", "Hard": "Hard" }[diff] || "");
  const mathDomainNames = ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"];
  const currentDomainNames = mathDomainNames;
  const currentQuestionStatus = getCurrentQuestionStatus();
  const isViewingAnsweredHistory = currentHistoryIndex !== null && questionHistory[currentHistoryIndex]?.isAnswered;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const katexMainScriptId = 'katex-main-script';
    const autoRenderScriptId = 'katex-auto-render-script';
    const loadScript = (src: string, id: string, onLoadCallback?: () => void) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.src = src; script.id = id; script.onload = onLoadCallback || null;
        document.body.appendChild(script);
      } else if (onLoadCallback) { onLoadCallback(); }
    };
    const applyKatexRender = () => {
      if (questionContentRef.current && typeof window.renderMathInElement !== 'undefined') {
        window.renderMathInElement(questionContentRef.current, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
          throwOnError: false
        });
      }
    };
    loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', katexMainScriptId, () => {
      loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js', autoRenderScriptId, () => {
        applyKatexRender();
      });
    });
    if (typeof window.renderMathInElement !== 'undefined') { applyKatexRender(); }
  }, [currentQuestion, subject, selectedAnswer, isSubmitted]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", margin: 0, padding: 0 }}>
      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
        <div style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", height: "fit-content" }}>
          <div style={{ marginBottom: "0px", position: "relative" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#333", position: "relative" }}>
              <span style={{ marginLeft: "8px", marginRight: "3px" }}>🧮 Math</span>
            </div>
            <a
              href="/practice/english" 
              style={{
                display: 'block',
                padding: "6px 10px",
                backgroundColor: "#e3f2fd",
                color: "#2196f3",
                border: "1px solid #2196f3",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "normal",
                textAlign: "center",
                textDecoration: "none",
                marginTop: "10px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Go to English <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
            </a>
          </div>
          <div style={{ height: "2px", backgroundColor: "#6e6e6e", width: "210px", marginBottom: "20px", marginTop: "20px" }}></div>
          <div style={{ marginBottom: "30px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Topics:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => setSelectedDomain("All")} style={{
                padding: "8px 12px", backgroundColor: selectedDomain === "All" ? "#e3f2fd" : "#e3f2fd",
                border: selectedDomain === "All" ? "2px solid #2196f3" : "0px solid #ddd", borderRadius: "4px",
                cursor: "pointer", fontSize: "14px", textAlign: "left", color: "black", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}>
                <i className="fas fa-list" style={{ marginRight: "8px" }}></i>All Topics
              </button>
              {currentDomainNames.map((domainName) => (
                <button key={domainName} onClick={() => setSelectedDomain(domainDisplayMapping[domainName as keyof typeof domainDisplayMapping])} style={{
                  padding: "8px 12px", backgroundColor: selectedDomain === domainDisplayMapping[domainName as keyof typeof domainDisplayMapping] ? "#e3f2fd" : "#e3f2fd",
                  border: selectedDomain === domainDisplayMapping[domainName as keyof typeof domainDisplayMapping] ? "2px solid #2196f3" : "0px solid #ddd",
                  borderRadius: "4px", cursor: "pointer", fontSize: "14px", textAlign: "left", color: "black", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>
                  {domainName}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Choose Difficulty:</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <div key={diff} style={{ position: "relative" }}>
                  <button onClick={() => setDifficulty(diff as "All" | "Easy" | "Medium" | "Hard")} style={{
                    width: "40px", height: "40px", borderRadius: "50%", border: difficulty === diff ? "3px solid #2196f3" : "2px solid #ddd",
                    backgroundColor: getDifficultyColor(diff), cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center",
                    justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }} title={getDifficultyTooltip(diff)}>
                    {getDifficultyEmoji(diff)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", gap: "20px" }}>
          <div ref={questionContentRef} style={{ flex: 2, backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "black" }}>
            {isLoading && <p>Loading question...</p>}
            {!isLoading && !currentQuestion && <p>No questions found for the selected filters. Please try a different selection.</p>}
            {!isLoading && currentQuestion ? (
              <>
                <div style={{ backgroundColor: "#e8f4f8", padding: "10px 15px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", color: "black", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  <div>
                    <span style={{ fontWeight: "bold" }}>Topic: {currentQuestion.domain} |{" "}</span>
                    <span style={{ fontWeight: "bold" }}>Difficulty:</span> {currentQuestion.difficulty}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setShowDesmos(!showDesmos)} style={{
                      padding: "6px 12px", backgroundColor: showDesmos ? "#e3f2fd" : "#fff",
                      border: `1px solid ${showDesmos ? "#2196f3" : "#ddd"}`, borderRadius: "4px", cursor: "pointer",
                      fontSize: "12px", fontWeight: "bold", color: showDesmos ? "#2196f3" : "#666", display: "flex",
                      alignItems: "center", gap: "4px", boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }} title="Launch Desmos Calculator">
                      <i className="fas fa-calculator"></i>
                    </button>
                    <button onClick={handleMarkForLater} style={{
                      padding: "6px 12px", backgroundColor: currentQuestionStatus?.isMarkedForLater ? "#fffbe6" : "#fff",
                      border: `1px solid ${currentQuestionStatus?.isMarkedForLater ? "#ffc107" : "#ddd"}`, borderRadius: "4px",
                      cursor: "pointer", fontSize: "12px", fontWeight: "bold", color: currentQuestionStatus?.isMarkedForLater ? "#ff8f00" : "#666",
                      display: "flex", alignItems: "center", gap: "4px", boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }} title="Mark for Later">
                      <i className={`fa-bookmark ${currentQuestionStatus?.isMarkedForLater ? 'fas' : 'far'}`}></i>
                    </button>
                  </div>
                </div>
                {/* Math questions don't have a paragraph, so that part is removed */}
                <div style={{ marginBottom: "20px", fontSize: "16px", lineHeight: "1.5", color: "#000000", fontWeight: "bold" }}>
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.question }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  {Object.entries(currentQuestion.question.choices).map(([key, value]) => {
                    const isSelected = selectedAnswer === key;
                    const isCorrectChoice = key === currentQuestion.question.correct_answer;
                    let borderColor = "#ddd";
                    let backgroundColor = "white";
                    if (isSubmitted) {
                      if (isCorrectChoice) { borderColor = "#4caf50"; backgroundColor = "#e8f5e9"; }
                      else if (isSelected && !isCorrect) { borderColor = "#f44336"; backgroundColor = "#ffebee"; }
                    } else if (isSelected) {
                      borderColor = "#2196f3"; backgroundColor = "#e3f2fd";
                    }
                    
                    const finalValue = value.includes('$') ? value : `$${value}$`;

                    return (
                      <button key={key} onClick={() => handleAnswerSelect(key)} disabled={isViewingAnsweredHistory || isSubmitted} style={{
                        display: "block", width: "100%", padding: "15px", marginBottom: "10px", border: `2px solid ${borderColor}`,
                        borderRadius: "6px", backgroundColor: backgroundColor, cursor: (isViewingAnsweredHistory || isSubmitted) ? "not-allowed" : "pointer",
                        textAlign: "left", fontSize: "16px", color: "black", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        opacity: (isViewingAnsweredHistory || isSubmitted) ? 0.7 : 1
                      }}>
                        <span style={{ fontWeight: "bold", marginRight: "8px" }}>{`${key}.`}</span>
                        <span dangerouslySetInnerHTML={{ __html: finalValue }} />
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {isSubmitted ? (
                    <button onClick={showNext} style={{
                      padding: "12px 24px", backgroundColor: "#4285f4", color: "white", border: "none",
                      borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "bold",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}>
                      Next <i className="fas fa-arrow-right"></i>
                    </button>
                  ) : (
                    !isViewingAnsweredHistory && (
                      <button onClick={handleSubmit} disabled={!selectedAnswer} style={{
                        padding: "12px 24px", backgroundColor: "#4285f4", color: "white", border: "none",
                        borderRadius: "6px", cursor: selectedAnswer ? "pointer" : "not-allowed", fontSize: "16px",
                        fontWeight: "bold", opacity: selectedAnswer ? 1 : 0.6, boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}>
                        Submit
                      </button>
                    )
                  )}
                </div>
                {showExplanation && (
                  <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", border: "1px solid #ddd", borderRadius: "6px", color: "#000000" }}>
                    {isCorrect ? (
                      <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#4caf50" }}>Correct!</div>
                    ) : (
                      <>
                        <div style={{ fontWeight: "bold", marginBottom: "10px", color: "black" }}>Explanation:</div>
                        <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.explanation }} />
                      </>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
          <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
                <i className="fas fa-star" style={{ marginRight: "8px" }}></i>Predicted Score
              </div>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#292F33", textAlign: "center", padding: '10px 0' }}>
                {mathTotal === 0 ? <span style={{ color: '#9e9e9e' }}> ---</span> : <span style={{ color: '#4285f4' }}> {predictedMathScore}</span>}
              </div>
            </div>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
                <i className="fas fa-fire" style={{ marginRight: "8px" }}></i>Streak
              </div>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#292F33", textAlign: "center", padding: '10px 0' }}>
                {currentStreak}
              </div>
            </div>
            <div style={{
              backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              position: "relative", zIndex: isAccuracyExpanded ? 10 : 1
            }}>
              <div style={{
                fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff",
                padding: "10px 15px 12px 15px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "space-between", cursor: 'pointer'
              }} onClick={() => setIsAccuracyExpanded(!isAccuracyExpanded)}>
                <span><i className="fas fa-bullseye" style={{ marginRight: "8px" }}></i>Accuracy</span>
                <i className={`fas fa-chevron-${isAccuracyExpanded ? 'up' : 'down'}`} style={{ transition: 'transform 0.3s ease' }}></i>
              </div>
              <div style={{ color: "black", padding: "15px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                  <span><i className="far fa-check-circle" style={{ marginRight: "8px", color: "#4caf50" }}></i>Correct: <strong>{correctCount}</strong></span>
                  <span><i className="far fa-times-circle" style={{ marginRight: "8px", color: "#f66055" }}></i>Incorrect: <strong>{wrongCount}</strong></span>
                </div>
                <div style={{
                  height: "17px", backgroundColor: totalAttempts === 0 ? "#e0e0e0" : "#f66055",
                  borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>
                  <div style={{ width: `${correctPercentage}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease", }} />
                </div>
              </div>
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#eff6ff",
                borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                maxHeight: isAccuracyExpanded ? "300px" : "0", overflow: "hidden",
                transition: "max-height 0.4s ease-in-out, padding 0.4s ease-in-out",
                padding: isAccuracyExpanded ? "15px" : "0 15px", color: 'black', borderTop: isAccuracyExpanded ? '1px solid #b0cfff' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}><i className="fas fa-square-root-alt" style={{ marginRight: "8px" }}></i>Math</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span><i className="far fa-check-circle" style={{ marginRight: "8px", color: "#4caf50" }}></i>Correct: <strong>{mathCorrect}</strong></span>
                    <span><i className="far fa-times-circle" style={{ marginRight: "8px", color: "#f66055" }}></i>Incorrect: <strong>{mathWrong}</strong></span>
                  </div>
                  <div style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", height: "12px", backgroundColor: mathTotal === 0 ? "#e0e0e0" : "#f66055", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${mathPercentage * 100}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease" }} />
                  </div>
                   <span  style={{fontSize: '13px', marginTop: '5px'}}><i className="fas fa-percent" style={{ marginRight: "8px", color: "#3399ff" }}></i>Percentage Accuracy: <strong>{mathPercentage * 100}%</strong></span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
                <i className="fas fa-tasks" style={{ marginRight: "8px" }}></i>Progress
              </div>
              <div style={{
                padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px', color: 'white',
                maxHeight: '125px', overflowY: 'auto'
              }}>
                {questionHistory.length === 0 && <span style={{ color: 'grey', fontSize: '14px' }}>Answer questions to see your progress.</span>}
                {questionHistory.map((item, index) => {
                  let bgColor;
                  if (item.isMarkedForLater) bgColor = "#ffc107";
                  else if (item.isCorrect === true) bgColor = "#66bb6a";
                  else if (item.isCorrect === false) bgColor = "#ef5350";
                  else bgColor = "#b0bec5";
                  return (
                    <button key={item.id} onClick={() => handleProgressBoxClick(index)} title={`Question ${index + 1}`} style={{
                      width: '35px', height: '35px', borderRadius: '6px', backgroundColor: bgColor,
                      border: currentHistoryIndex === index ? '3px solid #0d47a1' : 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                      fontSize: '14px', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', flexShrink: 0
                    }}>
                      {index + 1}
                    </button>
                  );
                })}
              </div>
</div>
          </div>
        </div>
      </div>
      {showDesmos && (
        <div ref={desmosRef} style={{
          position: 'fixed', top: desmosPosition.y, left: desmosPosition.x, width: desmosSize.width,
          height: desmosSize.height, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            cursor: 'grab', backgroundColor: '#f1f1f1', padding: '8px 12px', borderBottom: '1px solid #ccc',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold',
            fontSize: '14px', color: '#333'
          }} onMouseDown={(e) => handleMouseDown(e, 'drag')}>
            Desmos Calculator
            <button onClick={() => setShowDesmos(false)} style={{
              background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
            }}>
              &times;
            </button>
          </div>
          <iframe src="https://www.desmos.com/calculator" width="100%" height="100%" style={{ border: 'none' }} title="Desmos Calculator" />
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px',
            cursor: 'nwse-resize', backgroundColor: 'rgba(0,0,0,0.1)', borderTopLeftRadius: '5px',
          }} onMouseDown={(e) => handleMouseDown(e, 'resize')} />
        </div>
      )}
    </div>
  );
}
