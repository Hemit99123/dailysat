import { generateJWT } from "@/lib/jwt/action";
import { useStreakAnnouncerModalStore } from "@/store/modals";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore, useTopicStore } from "@/store/questions";
import { useScoreStore, useAnswerCounterStore } from "@/store/score";
import { Answers } from "@/types/sat-platform/answer";
import { Topic } from "@/types/sat-platform/topic";
import axios from "axios";
import { useAnswerAttemptsStore } from "@/store/questions"
import { questionType } from "@/types/sat-platform/questions";
import { useState } from "react";

// Custom hook to encapsulate logic because it is used in both math and reading/writing components
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

  const resetAttempts = useAnswerAttemptsStore((state) => state.resetAttempts) 
  const incrementAttempts = useAnswerAttemptsStore((state) => state.incrementAttempts)
  const attempts = useAnswerAttemptsStore((state) => state.attempts)

  // alreadyUsed is used for the 3 streaks modal. This way, whenever a new component re-render happens to subbed components
  // the correctCount === 3 is still there but since alr used, will not work again
  const [alreadyUsed, setAlreadyUsed] = useState(false)

  const fetchRandomQuestion = async (type: questionType, topic: Topic): Promise<void> => {
    try {
      let link = ""

      if (type == "math") {
        link = "/api/questions/math"
      } else {
        link = "/api/questions/reading"
      }
      const response = await axios.get(`${link}?topic=${topic.name}`);
      const questionData = response.data?.doc_array?.[0] ?? null;
      console.log(questionData)
      setRandomQuestion(questionData);
      setIsAnswerCorrect("none")
    } catch (error) {
      console.error("Error fetching question:", error);
      setRandomQuestion(null);
    }
  };

  const handleAnswerSubmit = async(
    type: questionType,
    correctAnswer: number, // Correct answer index
    answerCorrectRef: Record<Answers, number> = { A: 0, B: 1, C: 2, D: 3 } // Mapping for answer keys
  ) : Promise<void> => {
    const isCorrect = answerCorrectRef[answer ?? "A"] === correctAnswer;

    if (isCorrect) {
      increaseCorrectCounter();
      increaseScore();
      resetAttempts();
    } else {
      resetCorrectCounter();
      incrementAttempts();
    }

    setIsAnswerCorrect(isCorrect);

    // making a new token from a server-side action (function that runs on the SEVER!!)
    const token = await generateJWT({
      state: isCorrect == true ? 1 : 0,
      attempts
    })

    // Send request to backend
    await axios.post("/api/questions/handle-submit", {
          jwtToken: token
    });
    
    if (isCorrect && selectedTopic) {
      setTimeout(() => {
        fetchRandomQuestion(type, selectedTopic)
      }, 1500);
    }
  };

  const handleCheckThreeStreak = () => {
    if (correctCount === 3 && alreadyUsed == false) {
      openAnnouncerModal();
      setAlreadyUsed(true)
    }
  }

  return {
    fetchRandomQuestion,
    handleAnswerSubmit,
    handleCheckThreeStreak
  };
};

export default useQuestionHandler
