import { useState, useEffect } from "react";
import { Question, Data } from "@/types/hooks/practice";

// @ts-ignore
import { convert } from "html-to-text";

const DATA_URL = "https://api.jsonsilo.com/public/942c3c3b-3a0c-4be3-81c2-12029def19f5";
const QUESTION_LIST_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions";
const QUESTION_DETAIL_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question";

export const usePracticeSession = () => {
  const [data, setData] = useState<Data | null>(null);
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [englishDomains, setEnglishDomains] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchQuestionTrigger, setFetchQuestionTrigger] = useState(0);

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [englishCorrect, setEnglishCorrect] = useState<number>(0);
  const [englishWrong, setEnglishWrong] = useState<number>(0);
  const [predictedEnglishScore, setPredictedEnglishScore] = useState<number>(200);
  const [loadError, setLoadError] = useState<string | null>(null);

  const domainApiMapping: Record<string, string> = {
    "Information and Ideas": "INI",
    "Craft and Structure": "CAS",
    "Expression of Ideas": "EOI",
    "Standard English Conventions": "SEC",
  };

  const domainFullNameMapping: Record<string, string> = {
    INI: "Information and Ideas",
    CAS: "Craft and Structure",
    EOI: "Expression of Ideas",
    SEC: "Standard English Conventions",
  };

  const difficultyApiMapping: Record<string, string> = {
    Easy: "E",
    Medium: "M",
    Hard: "H",
  };

  const difficultyFullNameMapping: Record<string, string> = {
    E: "Easy",
    M: "Medium",
    H: "Hard",
  };

  const fetchEnglishQuestionFromApi = async (
    domain: string,
    difficulty: "All" | "Easy" | "Medium" | "Hard"
  ): Promise<Question | null> => {
    const apiDomain = domain === "All" ? "INI,CAS,EOI,SEC" : domainApiMapping[domain];

    const questionListResponse = await fetch(QUESTION_LIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (difficulty !== "All") {
      const apiDifficulty = difficultyApiMapping[difficulty];
      questionList = questionList.filter((q: any) => q.difficulty === apiDifficulty);
    }

    if (questionList.length === 0) {
      console.warn("No questions found after client-side difficulty filtering.");
      return null;
    }

    const randomQuestionInfo = questionList[Math.floor(Math.random() * questionList.length)];
    const externalId = randomQuestionInfo.external_id;

    const questionDetailResponse = await fetch(QUESTION_DETAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ external_id: externalId }),
    });

    if (!questionDetailResponse.ok) {
      console.error("Failed to fetch question detail from API:", questionDetailResponse.statusText);
      throw new Error("Failed to fetch question detail from API");
    }

    const questionData = await questionDetailResponse.json();
    const choices: Record<string, string> = {};
    const optionLetters = ["A", "B", "C", "D"];

    questionData.answerOptions.forEach((option: any, index: number) => {
      choices[optionLetters[index]] = convert(option.content);
    });

    const domainFullName =
      domainFullNameMapping[randomQuestionInfo.domain] || randomQuestionInfo.domain;
    const difficultyFullName =
      difficultyFullNameMapping[randomQuestionInfo.difficulty] || randomQuestionInfo.difficulty;

    return {
      id: questionData.external_id,
      domain: domainFullName,
      visuals: { type: "none", svg_content: "" },
      question: {
        question: questionData.stem.replace(/<[^>]*>/g, ""),
        paragraph: questionData.stimulus,
        explanation: questionData.rationale || questionData.explanation || "Explanation not provided by this API.",
        correct_answer: questionData.correct_answer[0],
        choices: choices,
      },
      difficulty: difficultyFullName,
    };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData: Data = await response.json();
        setData(jsonData);
        const uniqueEnglishDomains = Array.from(new Set(jsonData.english.map(q => q.domain)));
        setEnglishDomains(uniqueEnglishDomains);
      } catch (error) {
        console.error("Error fetching initial JSON data:", error);
        setLoadError("Failed to load practice questions. Please refresh the page.");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setCurrentQuestion(null);

    const loadQuestion = async () => {
      let newQuestion: Question | null = null;

      try {
        newQuestion = await fetchEnglishQuestionFromApi(selectedDomain, difficulty);
      } catch (error) {
        console.error("Error fetching English question from API. Falling back to local JSON:", error);
      }

      if (!newQuestion && data) {
        const allFilteredQuestions = data.english.filter(q => {
          const matchesDifficulty = difficulty === "All" || q.difficulty === difficulty;
          const matchesDomain = selectedDomain === "All" || q.domain === selectedDomain;
          return matchesDifficulty && matchesDomain;
        });

        if (allFilteredQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * allFilteredQuestions.length);
          newQuestion = allFilteredQuestions[randomIndex];
        }
      }

      setCurrentQuestion(newQuestion);
      setIsLoading(false);
    };

    if (data) loadQuestion();
  }, [data, difficulty, selectedDomain, fetchQuestionTrigger]);

  useEffect(() => {
    const englishTotal = englishCorrect + englishWrong;
    const englishPercentage = englishTotal === 0 ? 0 : englishCorrect / englishTotal;
    const newEnglishScore = Math.round(englishPercentage * 600 + 200);
    setPredictedEnglishScore(newEnglishScore);
  }, [englishCorrect, englishWrong]);

  const showNext = () => {
    setFetchQuestionTrigger(prev => prev + 1);
  };

  return {
    data,
    difficulty,
    setDifficulty,
    selectedDomain,
    setSelectedDomain,
    englishDomains,
    currentQuestion,
    setCurrentQuestion,
    isLoading,
    setIsLoading,
    correctCount,
    setCorrectCount,
    wrongCount,
    setWrongCount,
    currentStreak,
    setCurrentStreak,
    maxStreak,
    setMaxStreak,
    englishCorrect,
    setEnglishCorrect,
    englishWrong,
    setEnglishWrong,
    predictedEnglishScore,
    showNext,
    fetchEnglishQuestionFromApi,
  };
};
