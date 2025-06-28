"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
// Removed direct imports for remarkMath and rehypeKatex due to compilation errors
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// Removed direct CSS import for KaTeX to resolve font loading errors
// import 'katex/dist/katex.min.css';

// Add Font Awesome CSS dynamically
if (typeof window !== 'undefined') {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    if (!document.head.querySelector('link[href*="font-awesome"]')) {
      document.head.appendChild(fontAwesomeLink);
    }

    // Add KaTeX CSS dynamically to resolve font loading issues and CSS import errors
    const katexLink = document.createElement('link');
    katexLink.rel = 'stylesheet';
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'; // Using a CDN for KaTeX CSS
    if (!document.head.querySelector('link[href*="katex"]') && typeof document !== 'undefined') {
      document.head.appendChild(katexLink);
    }
}

// Declare global KaTeX object for TypeScript (optional, but good practice if not using ambient types)
declare global {
  interface Window {
    katex: any;
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}


// API URLs
const QUESTION_LIST_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions";
const QUESTION_DETAIL_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question";
const DATA_URL = "https://api.jsonsilo.com/public/942c3c3b-3a0c-4be3-81c2-12029def19f5";

// Type Definitions for Question and Data structures
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

export default function HomePage() {
  // State Management for question data and UI interactions
  const [data, setData] = useState<Data | null>(null);
  const [subject, setSubject] = useState<"Math" | "English">("Math");
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [mathDomains, setMathDomains] = useState<string[]>([]);
  const [englishDomains, setEnglishDomains] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchQuestionTrigger, setFetchQuestionTrigger] = useState(0); // State to force re-fetch of questions

  // State Management for statistics
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [mathCorrect, setMathCorrect] = useState<number>(0);
  const [mathWrong, setMathWrong] = useState<number>(0);
  const [englishCorrect, setEnglishCorrect] = useState<number>(0);
  const [englishWrong, setEnglishRight] = useState<number>(0);
  const [predictedMathScore, setPredictedMathScore] = useState<number>(200);
  const [predictedEnglishScore, setPredictedEnglishScore] = useState<number>(200);
  const [isAccuracyExpanded, setIsAccuracyExpanded] = useState<boolean>(false);

  // State Management for history and navigation
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number | null>(null);

  // State Management for Desmos Calculator (position, size, drag/resize flags)
  const [showDesmos, setShowDesmos] = useState(false);
  const desmosRef = useRef<HTMLDivElement>(null);
  const [desmosPosition, setDesmosPosition] = useState({ x: 0, y: 0 });
  const [desmosSize, setDesmosSize] = useState({ width: 400, height: 300 });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  
  // Ref for the main question content area to apply KaTeX rendering for math
  const questionContentRef = useRef<HTMLDivElement>(null);


  // Mappings for displaying and converting domain and difficulty values
  const domainDisplayMapping = {
    "Algebra": "Algebra",
    "Advanced Math": "Advanced Math",
    "Problem-Solving and Data Analysis": "Problem-Solving and Data Analysis",
    "Geometry and Trigonometry": "Geometry and Trigonometry",
    "Information and Ideas": "Information and Ideas",
    "Craft and Structure": "Craft and Structure",
    "Expression of Ideas": "Expression of Ideas",
    "Standard English Conventions": "Standard English Conventions"
  };

  const domainApiMapping: Record<string, string> = {
    "Information and Ideas": "INI",
    "Craft and Structure": "CAS",
    "Expression of Ideas": "EOI",
    "Standard English Conventions": "SEC",
  };

  const domainFullNameMapping: Record<string, string> = {
    "INI": "Information and Ideas",
    "CAS": "Craft and Structure",
    "EOI": "Expression of Ideas",
    "SEC": "Standard English Conventions",
  };

  const difficultyApiMapping: Record<string, string> = {
      "Easy": "E",
      "Medium": "M",
      "Hard": "H"
  };

  const difficultyFullNameMapping: Record<string, string> = {
      "E": "Easy",
      "M": "Medium",
      "H": "Hard"
  };

  // Calculated Statistics based on current state
  const totalAttempts = correctCount + wrongCount;
  const correctPercentage = totalAttempts === 0 ? 0 : (correctCount / totalAttempts) * 100;
  const mathTotal = mathCorrect + mathWrong;
  const mathPercentage = mathTotal === 0 ? 0 : (mathCorrect / mathTotal);
  const englishTotal = englishCorrect + englishWrong;
  const englishPercentage = englishTotal === 0 ? 0 : (englishCorrect / englishTotal);

  /**
   * Resets the UI states related to a single question's interaction.
   */
  const resetQuestionStates = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setIsSubmitted(false);
  };

  /**
   * Fetches an English question from the CollegeBoard API.
   * Handles filtering by domain and difficulty and maps the API response to local Question type.
   * @param domain - The selected topic/domain (e.g., "All", "Information and Ideas").
   * @param difficulty - The selected difficulty (e.g., "All", "Easy").
   * @returns A promise that resolves to a Question object or null.
   */
  const fetchEnglishQuestionFromApi = useCallback(async (domain: string, difficulty: "All" | "Easy" | "Medium" | "Hard"): Promise<Question | null> => {
    setIsLoading(true);
    // Determine API domain parameter from selected domain. If "All", include all English API domains.
    const apiDomain = domain === "All" 
      ? "INI,CAS,EOI,SEC" 
      : domainApiMapping[domain as keyof typeof domainApiMapping];

    // Fetch the list of question IDs from the CollegeBoard API
    const questionListResponse = await fetch(QUESTION_LIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asmtEventId: 100, test: 1, domain: apiDomain }),
    });

    if (!questionListResponse.ok) {
        console.error("Failed to fetch question list from API:", questionListResponse.statusText);
        throw new Error("Failed to fetch question list from API");
    }
    let questionList = await questionListResponse.json();
    if (questionList.length === 0) {
        console.warn("API returned no questions for the given filters.");
        return null;
    }

    // Filter the retrieved list by difficulty on the client-side
    if (difficulty !== "All") {
      const apiDifficulty = difficultyApiMapping[difficulty];
      questionList = questionList.filter((q: any) => q.difficulty === apiDifficulty);
    }
    if (questionList.length === 0) {
        console.warn("No questions found after client-side difficulty filtering.");
        return null;
    }

    // Select a random question from the filtered list
    const randomQuestionInfo = questionList[Math.floor(Math.random() * questionList.length)];
    const externalId = randomQuestionInfo.external_id;

    // Fetch the detailed question data using the external_id
    const questionDetailResponse = await fetch(QUESTION_DETAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ external_id: externalId }),
    });

    if (!questionDetailResponse.ok) {
        console.error("Failed to fetch question detail from API:", questionDetailResponse.statusText);
        throw new Error("Failed to fetch question detail from API");
    }
    const questionData = await questionDetailResponse.json();

    // Map the API response structure to the local 'Question' type
    const choices: Record<string, string> = {};
    const optionLetters = ['A', 'B', 'C', 'D']; // Standard answer options
    questionData.answerOptions.forEach((option: any, index: number) => {
      // For English, remove HTML from choices. For Math, preserve for KaTeX rendering.
      choices[optionLetters[index]] = subject === "English" ? option.content.replace(/<[^>]*>/g, '') : option.content;
    });

    // Get full names for domain and difficulty for display
    const domainFullName = domainFullNameMapping[randomQuestionInfo.domain] || randomQuestionInfo.domain;
    const difficultyFullName = difficultyFullNameMapping[randomQuestionInfo.difficulty] || randomQuestionInfo.difficulty;

    return {
      id: questionData.external_id,
      domain: domainFullName,
      visuals: { type: 'none', svg_content: '' }, // API does not provide SVG content in this structure
      question: {
        // For English, remove HTML from question stem. For Math, preserve for KaTeX rendering.
        question: subject === "English" ? questionData.stem.replace(/<[^>]*>/g, '') : questionData.stem,
        paragraph: questionData.stimulus, // Keep stimulus as HTML
        explanation: questionData.rationale || questionData.explanation || "Explanation not provided by this API.", // Explanation can contain HTML
        correct_answer: questionData.correct_answer[0],
        choices: choices,
      },
      difficulty: difficultyFullName,
    };
  }, [subject]); // Added 'subject' to dependencies as logic depends on it.

  /**
   * Fetches an English question from the local fallback JSON data.
   * Used when CollegeBoard API is not available or returns no results.
   */
  const fetchEnglishFromJson = useCallback(() => {
    if (data) {
      let currentSubjectQuestions: Question[] = data.english;
      let newFilteredQuestions = currentSubjectQuestions;

      // Apply difficulty filter
      if (difficulty !== "All") {
        newFilteredQuestions = newFilteredQuestions.filter((q) => q.difficulty === difficulty);
      }
      // Apply domain filter
      if (selectedDomain !== "All") {
        newFilteredQuestions = newFilteredQuestions.filter((q) => q.domain === selectedDomain);
      }

      setFilteredQuestions(newFilteredQuestions);
      if (newFilteredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * newFilteredQuestions.length);
        setCurrentQuestion(newFilteredQuestions[randomIndex]);
      } else {
        setCurrentQuestion(null);
      }
    }
  }, [data, difficulty, selectedDomain]);


  // Effect to fetch initial static JSON data (for Math and English fallback)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData: Data = await response.json();
        setData(jsonData);
        // Extract unique domains for math and english for filter options
        const uniqueMathDomains = Array.from(new Set(jsonData.math.map((q) => q.domain)));
        setMathDomains(uniqueMathDomains);
        const uniqueEnglishDomains = Array.from(new Set(jsonData.english.map((q) => q.domain)));
        setEnglishDomains(uniqueEnglishDomains);
      } catch (error) {
        console.error("Error fetching initial JSON data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Main Effect to load questions based on selected filters, subject, and fetch trigger
  useEffect(() => {
    const loadQuestion = async () => {
      // If currently viewing a question from history, do not load a new one
      if (currentHistoryIndex !== null) {
        setIsLoading(false); // Ensure loading state is false if stuck on history view
        return;
      }
      
      setIsLoading(true);
      setCurrentQuestion(null); // Clear previous question to show loading state clearly

      if (subject === 'English') {
        try {
          // Attempt to fetch from CollegeBoard API first
          const question = await fetchEnglishQuestionFromApi(selectedDomain, difficulty);
          if (question) {
            setCurrentQuestion(question);
            setFilteredQuestions([question]); // Set filtered questions for consistency
          } else {
            // If API returns no questions or issues, fallback to local JSON data
            fetchEnglishFromJson();
          }
        } catch (error) {
          console.error("English API failed, using fallback:", error);
          fetchEnglishFromJson(); // Fallback to JSON data on API error
        }
      } else { // Math subject (always uses local JSON data)
        if (data) {
          let newFilteredQuestions = data.math;
          // Apply filters
          if (difficulty !== "All") {
            newFilteredQuestions = newFilteredQuestions.filter((q) => q.difficulty === difficulty);
          }
          if (selectedDomain !== "All") {
            newFilteredQuestions = newFilteredQuestions.filter((q) => q.domain === selectedDomain);
          }

          setFilteredQuestions(newFilteredQuestions);
          if (newFilteredQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * newFilteredQuestions.length);
            setCurrentQuestion(newFilteredQuestions[randomIndex]);
          } else {
            setCurrentQuestion(null); // No math questions found for filters
          }
        }
      }

      resetQuestionStates(); // Reset answer selection and submission state for the new question
      setIsLoading(false);
    };

    // Only load questions if initial data is ready (for math or English fallback)
    // or if it's English and data is not yet loaded (allows API call without waiting for JSON)
    if ((subject === 'Math' && data) || (subject === 'English')) {
       loadQuestion();
    }


  }, [data, subject, difficulty, selectedDomain, currentHistoryIndex, fetchEnglishQuestionFromApi, fetchEnglishFromJson, fetchQuestionTrigger]); // `fetchQuestionTrigger` added here to force re-runs

  // Effect to reset selected domain when subject changes
  useEffect(() => {
    setSelectedDomain("All");
  }, [subject]);

  // Effect to update predicted scores based on accuracy
  useEffect(() => {
    const newMathScore = Math.round((mathPercentage * 600) + 200);
    setPredictedMathScore(newMathScore);
    const newEnglishScore = Math.round((englishPercentage * 600) + 200);
    setPredictedEnglishScore(newEnglishScore);
  }, [mathPercentage, englishPercentage]);

  /**
   * Handles user selecting an answer choice.
   * Prevents selection if already submitted or viewing history.
   * @param choice - The selected answer choice key (e.g., "A", "B").
   */
  const handleAnswerSelect = (choice: string) => {
    // Prevent selecting if an answer is already submitted or if viewing a past answered question
    if (isSubmitted || (currentHistoryIndex !== null && questionHistory[currentHistoryIndex].isAnswered)) return;
    setSelectedAnswer(choice);
  };

  /**
   * Handles user submitting their answer.
   * Checks correctness, updates statistics, and adds to history.
   */
  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(!correct); // Show explanation if incorrect

    // Update global and subject-specific correct/wrong counts
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      subject === "Math" ? setMathCorrect((prev) => prev + 1) : setEnglishCorrect((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((maxPrev) => Math.max(maxPrev, newStreak)); // Update max streak
        return newStreak;
      });
    } else {
      setWrongCount((prev) => prev + 1);
      subject === "Math" ? setMathWrong((prev) => prev + 1) : setEnglishRight((prev) => prev + 1);
      setCurrentStreak(0); // Reset streak if incorrect
    }

    // Update question history
    const existingIndex = questionHistory.findIndex(item => item.question.id === currentQuestion.id);
    if (existingIndex !== -1) {
      // If question already in history, update its details
      setQuestionHistory(prev => prev.map((item, index) =>
        index === existingIndex
          ? { ...item, userAnswer: selectedAnswer, isCorrect: correct, isAnswered: true }
          : item
      ));
    } else {
      // Add new question to history
      const newHistoryItem: QuestionHistory = {
        id: questionHistory.length + 1, // Simple ID for display in history box
        question: currentQuestion,
        userAnswer: selectedAnswer,
        isCorrect: correct,
        isMarkedForLater: false, // Not marked for later by default on submission
        isAnswered: true,
      };
      setQuestionHistory(prev => [...prev, newHistoryItem]);
    }
  };

  /**
   * Proceeds to the next question by resetting states and triggering a new question fetch.
   */
  const showNext = () => {
    setCurrentHistoryIndex(null); // Exit history view
    resetQuestionStates(); // Reset current question UI states
    setFetchQuestionTrigger(prev => prev + 1); // Increment trigger to load a new question
  };
  
  /**
   * Toggles the "Mark for Later" status of the current question.
   * Adds to history if not already present.
   */
  const handleMarkForLater = () => {
    if (!currentQuestion) return;
    const existingIndex = questionHistory.findIndex(item => item.question.id === currentQuestion.id);
    if (existingIndex !== -1) {
      // Toggle marked status if already in history
      setQuestionHistory(prev => prev.map((item, index) => 
        index === existingIndex ? { ...item, isMarkedForLater: !item.isMarkedForLater } : item
      ));
    } else {
      // Add to history as marked for later if not already present
      const newHistoryItem: QuestionHistory = {
        id: questionHistory.length + 1,
        question: currentQuestion,
        userAnswer: null, isCorrect: null, isMarkedForLater: true, isAnswered: false,
      };
      setQuestionHistory(prev => [...prev, newHistoryItem]);
    }
  };
  
  /**
   * Navigates to a specific question in the history.
   * Updates current question and UI states to reflect the historical question.
   * @param index - The index of the question in the history array.
   */
  const handleProgressBoxClick = (index: number) => {
    const historyItem = questionHistory[index];
    setCurrentHistoryIndex(index); // Set history index to view this specific question
    setCurrentQuestion(historyItem.question);
    setSelectedAnswer(historyItem.userAnswer);
    setIsCorrect(historyItem.isCorrect);
    setIsSubmitted(historyItem.isAnswered);
    setShowExplanation(historyItem.isAnswered && !historyItem.isCorrect);
  };
  
  /**
   * Finds the current question's status (answered, marked, etc.) from history.
   * @returns The QuestionHistory item for the current question or null.
   */
  const getCurrentQuestionStatus = () => {
    if (!currentQuestion) return null;
    return questionHistory.find(item => item.question.id === currentQuestion.id) || null;
  };
  
  // Desmos Calculator Logic (Drag, Resize)
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'drag' | 'resize') => {
    if (desmosRef.current) {
      const rect = desmosRef.current.getBoundingClientRect();
      if (type === 'drag') {
        isDragging.current = true;
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        isResizing.current = true;
        resizeStart.current = { x: e.clientX, y: e.clientY };
        initialSize.current = { width: rect.width, height: rect.height };
      }
      e.preventDefault(); // Prevent text selection
      document.body.style.userSelect = 'none'; // Disable text selection globally during drag/resize
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current && desmosRef.current) {
      setDesmosPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    } else if (isResizing.current && desmosRef.current) {
      // Calculate new width and height, ensuring minimum dimensions
      const newWidth = Math.max(300, initialSize.current.width + (e.clientX - resizeStart.current.x));
      const newHeight = Math.max(200, initialSize.current.height + (e.clientY - resizeStart.current.y));
      setDesmosSize({ width: newWidth, height: newHeight });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = false;
    document.body.style.userSelect = ''; // Re-enable text selection
  }, []);

  // Event listeners for mouse move and up for drag/resize functionality
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  // UI Helper Functions and Variables
  const getDifficultyEmoji = (diff: string) => ({ "All": "❓", "Easy": "😊", "Medium": "😐", "Hard": "😠" }[diff] || "❓");
  const getDifficultyColor = (diff: string) => ({ "Easy": "#4caf50", "Medium": "#F7DA1D", "Hard": "#f44336" }[diff] || "white");
  const getDifficultyTooltip = (diff: string) => ({ "All": "Any Difficulty", "Easy": "Easy", "Medium": "Medium", "Hard": "Hard" }[diff] || "");
  // Domain names for display in the filter sidebar
  const mathDomainNames = ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"];
  const englishDomainNames = ["Information and Ideas", "Craft and Structure", "Expression of Ideas", "Standard English Conventions"];
  const currentDomainNames = subject === "Math" ? mathDomainNames : englishDomainNames;
  const currentQuestionStatus = getCurrentQuestionStatus();
  // Flag to determine if the user is currently viewing a previously answered question from history
  const isViewingAnsweredHistory = currentHistoryIndex !== null && questionHistory[currentHistoryIndex]?.isAnswered;


  // Effect to load KaTeX's auto-render functionality for math expressions
  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure window is defined for client-side operations

    const katexMainScriptId = 'katex-main-script';
    const autoRenderScriptId = 'katex-auto-render-script';

    const loadScript = (src: string, id: string, onLoadCallback?: () => void) => {
        if (!document.getElementById(id)) {
            const script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.onload = onLoadCallback || null;
            document.body.appendChild(script);
        } else if (onLoadCallback) {
            // If script already exists, and we need to run a callback, run it now
            // This might be tricky if the script is still loading, but for subsequent renders, it should be fine.
            // A more robust solution might involve Promises or checking script.readyState
            onLoadCallback();
        }
    };

    const applyKatexRender = () => {
        if (questionContentRef.current && subject === "Math" && typeof window.renderMathInElement !== 'undefined') {
            window.renderMathInElement(questionContentRef.current, {
                delimiters: [
                    {left: '$$', right: '$$', display: true}, // Block math
                    {left: '$', right: '$', display: false},  // Inline math
                ],
                throwOnError : false // Don't throw errors for invalid LaTeX
            });
        }
    };

    // Load main KaTeX library first
    loadScript(
        'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
        katexMainScriptId,
        () => {
            // Once main KaTeX is loaded, load auto-render
            loadScript(
                'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
                autoRenderScriptId,
                () => {
                    // Once auto-render is loaded, apply the rendering
                    applyKatexRender();
                }
            );
        }
    );

    // Also, re-apply rendering if KaTeX is already loaded and dependencies change
    if (typeof window.renderMathInElement !== 'undefined') {
        applyKatexRender();
    }

  }, [currentQuestion, subject, selectedAnswer, isSubmitted]); // Re-run when current question, subject, selected answer, or submission status changes


  // Main JSX rendering for the SAT Prep Application
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", margin: 0, padding: 0 }}>
      {/* Header Section */}
      <div style={{ backgroundColor: "white", color: "#4285f4", padding: "15px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "24px", fontWeight: "bolder" }}>DailySAT</span>
         {/* Predicted Score Display */}
         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            <span style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Predicted Score</span>
            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                <div style={{fontSize: '16px', color: '#333'}}>
                    <span style={{fontWeight: '600'}}>Math:</span> 
                    {mathTotal === 0 ? 
                        <span style={{color: '#9e9e9e', fontWeight: 'bold'}}> ---</span> : 
                        <span style={{color: '#4285f4', fontWeight: 'bold'}}> {predictedMathScore}</span>
                    }
                </div>
                <div style={{fontSize: '16px', color: '#333'}}>
                    <span style={{fontWeight: '600'}}>English:</span>
                    {englishTotal === 0 ?
                         <span style={{color: '#9e9e9e', fontWeight: 'bold'}}> ---</span> : 
                         <span style={{color: '#4285f4', fontWeight: 'bold'}}> {predictedEnglishScore}</span>
                    }
                </div>
            </div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
        {/* Left Sidebar - Filters and Controls */}
        <div style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", height: "fit-content" }}>
          {/* Subject Selector */}
          <div style={{ marginBottom: "0px", position: "relative" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#333", position: "relative" }}> 
              <select
                onChange={(e) => setSubject(e.target.value as "Math" | "English")}
                value={subject}
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  marginLeft: "8px",
                  marginRight: "3px",
                  width: "100px"
                }}
              >
                <option value="Math">🧮 Math</option>
                <option value="English">📖 English</option>
              </select><i className="fas fa-chevron-down" style={{ fontSize: "14px" }}></i>
            </div>
          </div>
          <div style={{
            height: "2px",
            backgroundColor: "#6e6e6e",
            width: "140px",
            marginBottom: "20px"
          }}></div>

          {/* Topics Filter */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Topics:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => setSelectedDomain("All")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: selectedDomain === "All" ? "#e3f2fd" : "#e3f2fd",
                  border: selectedDomain === "All" ? "2px solid #2196f3" : "0px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "left",
                  color: "black",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <i className="fas fa-list" style={{ marginRight: "8px" }}></i>
                All Topics
              </button>
              {currentDomainNames.map((domainName) => (
                <button
                  key={domainName}
                  onClick={() => setSelectedDomain(domainDisplayMapping[domainName as keyof typeof domainDisplayMapping])}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: selectedDomain === domainDisplayMapping[domainName as keyof typeof domainDisplayMapping] ? "#e3f2fd" : "#e3f2fd",
                    border: selectedDomain === domainDisplayMapping[domainName as keyof typeof domainDisplayMapping] ? "2px solid #2196f3" : "0px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    textAlign: "left",
                    color: "black",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {domainName}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Choose Difficulty:</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <div key={diff} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDifficulty(diff as "All" | "Easy" | "Medium" | "Hard")}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: difficulty === diff ? "3px solid #2196f3" : "2px solid #ddd",
                      backgroundColor: getDifficultyColor(diff),
                      cursor: "pointer",
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    title={getDifficultyTooltip(diff)}
                  >
                    {getDifficultyEmoji(diff)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", gap: "20px" }}>
          {/* Question Display Area */}
          <div ref={questionContentRef} style={{ flex: 2, backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "black" }}>
            {isLoading && <p>Loading question...</p>}
            {!isLoading && !currentQuestion && <p>No questions found for the selected filters. Please try a different selection.</p>}
            {!isLoading && currentQuestion ? (
              <>
                {/* Question Header (Topic, Difficulty, Calculator, Mark for Later) */}
                <div style={{ backgroundColor: "#e8f4f8", padding: "10px 15px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", color: "black", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  <div>
                    {/* Conditional display for English topic based on "All Topics" selection */}
                    {!(subject === "English" && selectedDomain === "All") && currentQuestion ? (
                        <span style={{ fontWeight: "bold" }}>
                            Topic: {currentQuestion.domain} |{" "}
                        </span>
                    ) : null}
                    <span style={{ fontWeight: "bold" }}>Difficulty:</span> {currentQuestion.difficulty}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* Desmos Calculator Button */}
                    <button
                      onClick={() => setShowDesmos(!showDesmos)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: showDesmos ? "#e3f2fd" : "#fff",
                        border: `1px solid ${showDesmos ? "#2196f3" : "#ddd"}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: showDesmos ? "#2196f3" : "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      title="Launch Desmos Calculator"
                    >
                      <i className="fas fa-calculator"></i>
                    </button>
                    {/* Mark for Later Button */}
                    <button
                      onClick={handleMarkForLater}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: currentQuestionStatus?.isMarkedForLater ? "#fffbe6" : "#fff",
                        border: `1px solid ${currentQuestionStatus?.isMarkedForLater ? "#ffc107" : "#ddd"}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: currentQuestionStatus?.isMarkedForLater ? "#ff8f00" : "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      title="Mark for Later"
                    >
                      <i className={`fa-bookmark ${currentQuestionStatus?.isMarkedForLater ? 'fas' : 'far'}`}></i>
                    </button>
                  </div>
                </div>

                 {/* Paragraph/Stimulus for English questions */}
                 {subject === "English" && currentQuestion.question.paragraph && ( // Only render for English and if paragraph exists
                    <div
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            backgroundColor: '#f1f1f1',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                        // Dangerously set inner HTML as paragraph content can contain HTML tags
                        dangerouslySetInnerHTML={{ __html: currentQuestion.question.paragraph }}
                    />
                )}

                {/* Question Text */}
                <div style={{ marginBottom: "20px", fontSize: "16px", lineHeight: "1.5", color: "#000000", fontWeight: "bold" }}>
                  {/* Render question using dangerouslySetInnerHTML, KaTeX will process math if present */}
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.question }} />
                </div>

                {/* Answer Choices */}
                <div style={{ marginBottom: "20px" }}>
                  {Object.entries(currentQuestion.question.choices).map(([key, value]) => {
                    const isSelected = selectedAnswer === key;
                    const isCorrectChoice = key === currentQuestion.question.correct_answer;
                    let borderColor = "#ddd";
                    let backgroundColor = "white";

                    // Styling based on submission status and correctness
                    if (isSubmitted) {
                        if(isCorrectChoice){ borderColor = "#4caf50"; backgroundColor = "#e8f5e9"; } // Correct answer
                        else if (isSelected && !isCorrect) { borderColor = "#f44336"; backgroundColor = "#ffebee"; } // Incorrect user answer
                    } else if (isSelected) {
                        borderColor = "#2196f3"; backgroundColor = "#e3f2fd"; // Selected but not submitted
                    }

                    return (
                      <button key={key} onClick={() => handleAnswerSelect(key)} disabled={isViewingAnsweredHistory} style={{
                          display: "block", width: "100%", padding: "15px", marginBottom: "10px", border: `2px solid ${borderColor}`,
                          borderRadius: "6px", backgroundColor: backgroundColor, cursor: isViewingAnsweredHistory ? "not-allowed" : "pointer",
                          textAlign: "left", fontSize: "16px", color: "black", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          opacity: isViewingAnsweredHistory ? 0.7 : 1
                      }}>
                        {subject === "Math" ? (
                          <>
                            <span style={{ fontWeight: "bold", marginRight: "8px" }}>{key}.</span>
                            {/* Render math choices with dangerouslySetInnerHTML, KaTeX will process math if present */}
                            <span dangerouslySetInnerHTML={{ __html: value }} /> 
                          </>
                        ) : (
                          // English choices are plain text (after stripping HTML), direct span
                          <span>{`${key}. ${value}`}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons (Submit/Next) & Explanation Display */}
                <div style={{ display: "flex", gap: "10px" }}>
                    {isSubmitted ? (
                      <button
                        onClick={showNext}
                        style={{
                          padding: "12px 24px",
                          backgroundColor: "#4285f4",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        Next <i className="fas fa-arrow-right"></i>
                      </button>
                    ) : (
                       !isViewingAnsweredHistory && ( // Only show submit if not viewing answered history
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedAnswer} // Disable if no answer is selected
                            style={{
                            padding: "12px 24px",
                            backgroundColor: "#4285f4",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: selectedAnswer ? "pointer" : "not-allowed",
                            fontSize: "16px",
                            fontWeight: "bold",
                            opacity: selectedAnswer ? 1 : 0.6,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            Submit
                        </button>
                       )
                    )}
                </div>
                {/* Explanation section, shown if answer is incorrect or explicitly flagged to show */}
                {showExplanation && (
                  <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", border: "1px solid #ddd", borderRadius: "6px", color: "#000000" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "10px", color: "black" }}>Explanation:</div>
                    {/* Render explanation HTML directly using dangerouslySetInnerHTML */}
                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.question.explanation }} />
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Right Sidebar - Stats and Progress */}
          <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
             {/* Streak Box */}
             <div
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                overflow: 'hidden'
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px"}}>
                <i className="fas fa-fire" style={{ marginRight: "8px" }}></i>
                Streak
              </div>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#292F33", textAlign: "center", padding: '10px 0'}}>
                {currentStreak}
              </div>
            </div>

            {/* Accuracy Box (Collapsible) */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: isAccuracyExpanded ? 10 : 1 // Ensure it overlaps other elements when expanded
              }}
            >
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "bold", 
                color: "#292F33", 
                background: "#99c6ff", 
                padding: "10px 15px 12px 15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: 'pointer'
              }}
              onClick={() => setIsAccuracyExpanded(!isAccuracyExpanded)} // Toggle expanded state on click
              >
                <span>
                  <i className="fas fa-bullseye" style={{ marginRight: "8px" }}></i>
                  Accuracy
                </span>
                <i 
                    className={`fas fa-chevron-${isAccuracyExpanded ? 'up' : 'down'}`}
                    style={{
                      transition: 'transform 0.3s ease' // Smooth animation for chevron icon
                    }}
                  ></i>
              </div>
              
              {/* Overall Stats (Always visible part) */}
              <div style={{color: "black", padding:"15px"}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                  <span><i className="far fa-check-circle" style={{ marginRight: "8px",color: "#4caf50" }}></i>Correct: <strong>{correctCount}</strong></span>
                  <span><i className="far fa-times-circle" style={{ marginRight: "8px",color: "#f66055" }}></i>Incorrect: <strong>{wrongCount}</strong></span>
                </div>
                <div style={{
                  height: "17px",
                  backgroundColor: totalAttempts === 0 ? "#e0e0e0" : "#f66055", // Grey if no attempts, else red
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>
                  <div
                    style={{
                      width: `${correctPercentage}%`,
                      height: "100%",
                      backgroundColor: "#4caf50",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Expanded Subject-Specific Stats (Conditionally visible) */}
              <div
                style={{
                  position: "absolute",
                  top: "100%", // Position directly below the main accuracy box
                  left: 0,
                  right: 0,
                  backgroundColor: "#eff6ff",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  maxHeight: isAccuracyExpanded ? "300px" : "0", // Control visibility with maxHeight for smooth transition
                  overflow: "hidden",
                  transition: "max-height 0.4s ease-in-out, padding 0.4s ease-in-out",
                  padding: isAccuracyExpanded ? "15px" : "0 15px", // Adjust padding for smooth transition
                  color: 'black',
                  borderTop: isAccuracyExpanded ? '1px solid #b0cfff' : 'none' // Border when expanded
                }}
              >
                 {/* Math Stats */}
                 <div style={{marginBottom: "15px"}}>
                    <div style={{fontWeight: 'bold', marginBottom: '5px'}}><i className="fas fa-square-root-alt" style={{ marginRight: "8px" }}></i> Math</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                        <span><i className="far fa-check-circle" style={{ marginRight: "8px",color: "#4caf50" }}></i>Correct: <strong>{mathCorrect}</strong></span>
                        <span><i className="far fa-times-circle" style={{ marginRight: "8px",color: "#f66055"}}></i>Incorrect: <strong>{mathWrong}</strong></span>
                    </div>
                     <div style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", height: "12px", backgroundColor: mathTotal === 0 ? "#e0e0e0" : "#f66055", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ width: `${mathPercentage * 100}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease" }} />
                    </div>
                 </div>

                 {/* English Stats */}
                 <div>
                    <div style={{fontWeight: 'bold', marginBottom: '5px'}}><i className="fas fa-book-open" style={{ marginRight: "8px" }}></i>English</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                        <span><i className="far fa-check-circle" style={{ marginRight: "8px",color: "#4caf50" }}></i>Correct: <strong>{englishCorrect}</strong></span>
                        <span><i className="far fa-times-circle" style={{ marginRight: "8px",color: "#f66055" }}></i>Incorrect: <strong>{englishWrong}</strong></span>
                    </div>
                     <div style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", height: "12px", backgroundColor: englishTotal === 0 ? "#e0e0e0" : "#f66055", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ width: `${englishPercentage * 100}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease" }} />
                    </div>
                 </div>
              </div>
            </div>

            {/* Progress Box (Question History Overview) */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                overflow: 'hidden'
              }}
            >
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px"}}>
                    <i className="fas fa-tasks" style={{ marginRight: "8px" }}></i>
                    Progress
                </div>
                <div style={{
                    padding: '15px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    color: 'white',
                    maxHeight: '125px', // Limit height for scrollability
                    overflowY: 'auto'
                }}>
                    {questionHistory.length === 0 && <span style={{color: 'grey', fontSize: '14px'}}>Answer questions to see your progress.</span>}
                    {questionHistory.map((item, index) => {
                        let bgColor;
                        if (item.isMarkedForLater) {
                            bgColor = "#ffc107"; // Yellow for marked, takes precedence
                        } else if (item.isCorrect === true) {
                            bgColor = "#66bb6a"; // Green for correct
                        } else if (item.isCorrect === false) {
                            bgColor = "#ef5350"; // Red for incorrect
                        } else {
                            bgColor = "#b0bec5"; // Default grey for unanswered
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleProgressBoxClick(index)}
                                title={`Question ${index + 1}`}
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '6px',
                                    backgroundColor: bgColor,
                                    border: currentHistoryIndex === index ? '3px solid #0d47a1' : 'none', // Highlight if currently viewing
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: 'white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                    flexShrink: 0 // Prevent boxes from shrinking
                                }}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desmos Calculator Embed (Fixed position, draggable, resizable) */}
      {showDesmos && (
        <div ref={desmosRef} style={{
            position: 'fixed',
            top: desmosPosition.y,
            left: desmosPosition.x,
            width: desmosSize.width,
            height: desmosSize.height,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000, // Ensure it's on top of other content
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Hide overflow from resize handle
          }}>
            <div
                style={{
                cursor: 'grab', // Indicate draggable area
                backgroundColor: '#f1f1f1',
                padding: '8px 12px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#333'
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
                Desmos Calculator
                <button
                onClick={() => setShowDesmos(false)} // Close button
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#666'
                }}
                >
                &times;
                </button>
            </div>
            <iframe
                src="https://www.desmos.com/calculator"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Desmos Calculator"
            />
            {/* Resize handle */}
            <div
                style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '15px',
                height: '15px',
                cursor: 'nwse-resize', // Diagonal resize cursor
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderTopLeftRadius: '5px',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
        </div>
      )}
    </div>
  );
}
