import { useStreakAnnouncerModalStore } from "@/store/modals";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore, useTopicStore } from "@/store/questions";
import { useScoreStore, useAnswerCounterStore } from "@/store/score";
import { Answers } from "@/types/answer";
import { Topic } from "@/types/topic";
import axios from "axios";

// Custom hook to encapsulate logic
const useQuestionHandler = () => {
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion);
  const answer = useAnswerStore((state) => state.answer);
  const increaseScore = useScoreStore((state) => state.increaseScore);
  const increaseCorrectCounter = useAnswerCounterStore((state) => state.increaseCount);
  const resetCorrectCounter = useAnswerCounterStore((state) => state.resetCount);
  const selectedTopic = useTopicStore((state) => state.selectedTopic);
  const setIsAnswerCorrect = useAnswerCorrectStore((state) => state.setIsAnswerCorrect);
  const correctCount = useAnswerCounterStore((state) => state.count);
  const openAnnouncerModal = useStreakAnnouncerModalStore((state) => state.openModal);

  const fetchRandomQuestion = async (type: "Math" | "Reading", topic: Topic): Promise<void> => {
    try {
      let link = ""

      if (type == "Math") {
        link = "/api/questions/math"
      } else {
        link = "/api/questions/reading"
      }
      const response = await axios.get(`${link}?topic=${topic.name}`);
      const questionData = response.data?.doc_array?.[0] ?? null;
      setRandomQuestion(questionData);
      setIsAnswerCorrect("none")
    } catch (error) {
      console.error("Error fetching question:", error);
      setRandomQuestion(null);
    }
  };

  const handleAnswerSubmit = async(
    type: "Math" | "Reading",
    correctAnswer: number, // Correct answer index
    answerCorrectRef: Record<Answers, number> = { A: 0, B: 1, C: 2, D: 3 } // Mapping for answer keys
  ) : Promise<void> => {
    const isCorrect = answerCorrectRef[answer || "A"] === correctAnswer;

    if (isCorrect) {
      increaseCorrectCounter();
      increaseScore();
    } else {
      resetCorrectCounter();
    }

    setIsAnswerCorrect(isCorrect);

    // Send request to backend
    if (useQuestionStore.getState().randomQuestion !== null) {
      await axios.post("/api/add-points", {
        question: useQuestionStore.getState().randomQuestion ,
        state: isCorrect == true ? 1 : 0,
        userAnswer: answerCorrectRef[answer || "A"]
      })
    }
    
    if (isCorrect && selectedTopic) {
      setTimeout(() => {
        fetchRandomQuestion(type, selectedTopic)
      }, 1500);
    }
  };

  const handleCheckThreeStreak = () => {
    if (correctCount === 3 || correctCount === 7) {
      openAnnouncerModal();
    }
  }

  return {
    fetchRandomQuestion,
    handleAnswerSubmit,
    handleCheckThreeStreak
  };
};

export default useQuestionHandler