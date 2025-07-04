"use client";
import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    katex: any;
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}

const QUESTION_LIST_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions";
const QUESTION_DETAIL_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question";
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

export default function EnglishPracticePage() {
  const [data, setData] = useState<Data | null>(null);
  const subject: "English" = "English";
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [englishDomains, setEnglishDomains] = useState<string[]>([]);
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
  const [englishCorrect, setEnglishCorrect] = useState<number>(0);
  const [englishWrong, setEnglishWrong] = useState<number>(0);
  const [predictedEnglishScore, setPredictedEnglishScore] = useState<number>(200);
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
    "Information and Ideas": "Information and Ideas", "Craft and Structure": "Craft and Structure", "Expression of Ideas": "Expression of Ideas", "Standard English Conventions": "Standard English Conventions"
  };
  const domainApiMapping: Record<string, string> = {
    "Information and Ideas": "INI", "Craft and Structure": "CAS", "Expression of Ideas": "EOI", "Standard English Conventions": "SEC",
  };
  const domainFullNameMapping: Record<string, string> = {
    "INI": "Information and Ideas", "CAS": "Craft and Structure", "EOI": "Expression of Ideas", "SEC": "Standard English Conventions",
  };
  const difficultyApiMapping: Record<string, string> = {
    "Easy": "E", "Medium": "M", "Hard": "H"
  };
  const difficultyFullNameMapping: Record<string, string> = {
    "E": "Easy", "M": "Medium", "H": "Hard"
  };

  const totalAttempts = correctCount + wrongCount;
  const correctPercentage = totalAttempts === 0 ? 0 : (correctCount / totalAttempts) * 100;
  const englishTotal = englishCorrect + englishWrong;
  const englishPercentage = englishTotal === 0 ? 0 : (englishCorrect / englishTotal);

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

  const fetchEnglishQuestionFromApi = useCallback(async (domain: string, difficulty: "All" | "Easy" | "Medium" | "Hard"): Promise<Question | null> => {
    setIsLoading(true);
    const apiDomain = domain === "All" ? "INI,CAS,EOI,SEC" : domainApiMapping[domain as keyof typeof domainApiMapping];
    const questionListResponse = await fetch(QUESTION_LIST_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ asmtEventId: 100, test: 1, domain: apiDomain }),
    });
    if (!questionListResponse.ok) { console.error("Failed to fetch question list from API:", questionListResponse.statusText); throw new Error("Failed to fetch question list from API"); }
    let questionList = await questionListResponse.json();
    if (questionList.length === 0) { console.warn("API returned no questions for the given filters."); return null; }
    if (difficulty !== "All") {
      const apiDifficulty = difficultyApiMapping[difficulty];
      questionList = questionList.filter((q: any) => q.difficulty === apiDifficulty);
    }
    if (questionList.length === 0) { console.warn("No questions found after client-side difficulty filtering."); return null; }
    const randomQuestionInfo = questionList[Math.floor(Math.random() * questionList.length)];
    const externalId = randomQuestionInfo.external_id;
    const questionDetailResponse = await fetch(QUESTION_DETAIL_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ external_id: externalId }),
    });
    if (!questionDetailResponse.ok) { console.error("Failed to fetch question detail from API:", questionDetailResponse.statusText); throw new Error("Failed to fetch question detail from API"); }
    const questionData = await questionDetailResponse.json();
    const choices: Record<string, string> = {};
    const optionLetters = ['A', 'B', 'C', 'D'];
    questionData.answerOptions.forEach((option: any, index: number) => {
      choices[optionLetters[index]] = option.content.replace(/<[^>]*>/g, '');
    });
    const domainFullName = domainFullNameMapping[randomQuestionInfo.domain] || randomQuestionInfo.domain;
    const difficultyFullName = difficultyFullNameMapping[randomQuestionInfo.difficulty] || randomQuestionInfo.difficulty;
    return {
      id: questionData.external_id, domain: domainFullName, visuals: { type: 'none', svg_content: '' },
      question: {
        question: questionData.stem.replace(/<[^>]*>/g, ''), paragraph: questionData.stimulus,
        explanation: questionData.rationale || questionData.explanation || "Explanation not provided by this API.",
        correct_answer: questionData.correct_answer[0], choices: choices,
      }, difficulty: difficultyFullName,
    };
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData: Data = await response.json();
        setData(jsonData);
        const uniqueEnglishDomains = Array.from(new Set(jsonData.english.map((q) => q.domain)));
        setEnglishDomains(uniqueEnglishDomains);
      } catch (error) { console.error("Error fetching initial JSON data:", error); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentHistoryIndex !== null) { setIsLoading(false); return; }
    setIsLoading(true);
    setCurrentQuestion(null);

    const loadQuestion = async () => {
      let newQuestion: Question | null = null;
      let allFilteredQuestions: Question[] = [];

      if (data && data.english.length > 0) {
        allFilteredQuestions = data.english.filter(q => {
          const matchesDifficulty = difficulty === "All" || q.difficulty === difficulty;
          const matchesDomain = selectedDomain === "All" || q.domain === selectedDomain;
          return matchesDifficulty && matchesDomain;
        });
      }

      try {
        const apiQuestion = await fetchEnglishQuestionFromApi(selectedDomain, difficulty);
        if (apiQuestion) {
          newQuestion = apiQuestion;
        }
      } catch (error) {
        console.error("Error fetching English question from API, falling back to JSON:", error);
      }

      if (!newQuestion || questionHistoryRef.current.some(item => item.question.id === newQuestion?.id && item.isAnswered)) {
        const attemptedQuestionIds = new Set(questionHistoryRef.current.filter(item => item.isAnswered).map(item => item.question.id));
        const unattemptedLocalQuestions = allFilteredQuestions.filter(q => !attemptedQuestionIds.has(q.id));

        if (unattemptedLocalQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * unattemptedLocalQuestions.length);
          newQuestion = unattemptedLocalQuestions[randomIndex];
        } else if (allFilteredQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * allFilteredQuestions.length);
          newQuestion = allFilteredQuestions[randomIndex];
        } else {
          newQuestion = null;
        }
      }

      setCurrentQuestion(newQuestion);
      resetQuestionStates();
      setIsLoading(false);
    };

    loadQuestion();
  }, [data, difficulty, selectedDomain, currentHistoryIndex, fetchQuestionTrigger, subject, fetchEnglishQuestionFromApi]);

  useEffect(() => {
    const newEnglishScore = Math.round((englishPercentage * 600) + 200);
    setPredictedEnglishScore(newEnglishScore);
  }, [englishPercentage]);

  const handleAnswerSelect = (choice: string) => {
    if (isSubmitted || (currentHistoryIndex !== null && questionHistory[currentHistoryIndex].isAnswered)) return;
    setSelectedAnswer(choice);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true); // Always show explanation after submission

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setEnglishCorrect((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((maxPrev) => Math.max(maxPrev, newStreak));
        return newStreak;
      });
    } else {
      setWrongCount((prev) => prev + 1);
      setEnglishWrong((prev) => prev + 1);
      setCurrentStreak(0);
    }

    setQuestionHistory(prev => {
        const historyCopy = [...prev];
        // Find if an unanswered entry for this question already exists (e.g., from being marked for later).
        const existingUnansweredIndex = historyCopy.findIndex(
            item => item.question.id === currentQuestion.id && !item.isAnswered
        );

        if (existingUnansweredIndex !== -1) {
            // If an unanswered entry exists, update it. This preserves the 'isMarkedForLater' status.
            historyCopy[existingUnansweredIndex] = {
                ...historyCopy[existingUnansweredIndex],
                userAnswer: selectedAnswer,
                isCorrect: correct,
                isAnswered: true,
            };
            return historyCopy;
        } else {
            // Otherwise, create a new history entry.
            // This assumes we don't need to worry about re-answering already answered questions.
            const newHistoryItem: QuestionHistory = {
                id: prev.length + 1,
                question: currentQuestion,
                userAnswer: selectedAnswer,
                isCorrect: correct,
                isMarkedForLater: false, // A direct submission is not marked by default.
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
  const englishDomainNames = ["Information and Ideas", "Craft and Structure", "Expression of Ideas", "Standard English Conventions"];
  const currentDomainNames = englishDomainNames;
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
    // The rest of the JSX remains unchanged.
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", margin: 0, padding: 0 }}>
      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
        <div style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", height: "fit-content" }}>
          <div style={{ marginBottom: "0px", position: "relative" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#333", position: "relative" }}>
              <span style={{ marginLeft: "8px", marginRight: "3px" }}>📖 English</span>
            </div>
            {/* New button to go to Math page, placed under the subject display */}
            <a
              href="/practice/math"
              style={{
                display: 'block', // Make it a block element to take full width
                padding: "6px 10px", // Smaller padding
                backgroundColor: "#e3f2fd",
                color: "#2196f3", // Less bold color
                border: "1px solid #2196f3",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px", // Smaller font size
                fontWeight: "normal", // Less bold
                textAlign: "center",
                textDecoration: "none", // Remove underline
                marginTop: "10px", // Add some space below the subject title
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Go to Math <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
            </a>
          </div>
          <div style={{ height: "2px", backgroundColor: "#6e6e6e", width: "210px", marginBottom: "20px", marginTop: "20px" }}></div> {/* Adjusted margin-top */}
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
                    {!(subject === "English" && selectedDomain === "All") && currentQuestion ? (
                      <span style={{ fontWeight: "bold" }}>Topic: {currentQuestion.domain} |{" "}</span>
                    ) : null}
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
                {subject === "English" && currentQuestion.question.paragraph && (
                  <div style={{
                    marginBottom: '20px', padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '6px',
                    border: '1px solid #e0e0e0', fontSize: '15px', lineHeight: '1.6', maxHeight: '200px', overflowY: 'auto'
                  }} dangerouslySetInnerHTML={{ __html: currentQuestion.question.paragraph }} />
                )}
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
                    return (
                      <button key={key} onClick={() => handleAnswerSelect(key)} disabled={isViewingAnsweredHistory || isSubmitted} style={{ // Disable choices after submission
                        display: "block", width: "100%", padding: "15px", marginBottom: "10px", border: `2px solid ${borderColor}`,
                        borderRadius: "6px", backgroundColor: backgroundColor, cursor: (isViewingAnsweredHistory || isSubmitted) ? "not-allowed" : "pointer",
                        textAlign: "left", fontSize: "16px", color: "black", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        opacity: (isViewingAnsweredHistory || isSubmitted) ? 0.7 : 1
                      }}>
                        <span>{`${key}. ${value}`}</span>
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
            {/* New Predicted Score Box */}
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
                <i className="fas fa-star" style={{ marginRight: "8px" }}></i>Predicted Score
              </div>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#292F33", textAlign: "center", padding: '10px 0' }}>
                {englishTotal === 0 ? <span style={{ color: '#9e9e9e' }}> ---</span> : <span style={{ color: '#4285f4' }}> {predictedEnglishScore}</span>}
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
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}><i className="fas fa-book-open" style={{ marginRight: "8px" }}></i>English</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span><i className="far fa-check-circle" style={{ marginRight: "8px", color: "#4caf50" }}></i>Correct: <strong>{englishCorrect}</strong></span>
                    <span><i className="far fa-times-circle" style={{ marginRight: "8px", color: "#f66055" }}></i>Incorrect: <strong>{englishWrong}</strong></span>
                  </div>
                  <div style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", height: "12px", backgroundColor: englishTotal === 0 ? "#e0e0e0" : "#f66055", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${englishPercentage * 100}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease" }} />
                  </div>
                  <span  style={{fontSize: '13px', marginTop: '5px'}}><i className="fas fa-percent" style={{ marginRight: "8px", color: "#3399ff" }}></i>Percentage Accuracy: <strong>{englishPercentage * 100}%</strong></span>
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
                  if (item.isMarkedForLater) bgColor = "#ffc107"; // Yellow for marked for later
                  else if (item.isCorrect === true) bgColor = "#66bb6a"; // Green for correct
                  else if (item.isCorrect === false) bgColor = "#ef5350"; // Red for incorrect
                  else bgColor = "#b0bec5"; // Grey for unanswered/unmarked
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