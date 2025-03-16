"use client"

import Sidebar from "@/components/features/Sidebar/Sidebar";
import { mathTopics } from '@/data/topics'; 
import MathSVG from "@/components/features/Questions/icons/MathSVG";
import { Topic } from "@/types/sat-platform/topic";
import { useEffect, useRef } from "react";
import MathQuestion from "@/components/features/Questions/Question-UI/QuestionModules/MathQuestion";
import Header from "@/components/features/Questions/Question-UI/Header";
import { Answers } from "@/types/sat-platform/answer";
import StreakAnnouncer from "@/components/features/Questions/Modals/StreakAnnouncer";
import useQuestionHandler from "@/hooks/questions";
import Spinner from "@/components/common/Spinner";
import GetStarted from "@/components/features/Questions/Question-UI/GetStarted";
import Result from "@/components/features/Questions/Question-UI/Results";
import { useQuestionStore, useTopicStore } from "@/store/questions";
import QuestionWrappers from "@/components/wrappers/question/Question";
import MainWrappers from "@/components/wrappers/question/Main";

const Math = () => {
  const {fetchRandomQuestion, handleAnswerSubmit, handleCheckThreeStreak} = useQuestionHandler()
  const selectedTopic = useTopicStore((state) => state.selectedTopic)
  const setSelectedTopic = useTopicStore((state) => state.setSelectedTopic)
  const randomQuestion = useQuestionStore((state) => state.randomQuestion)
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion)

  const answerCorrectRef: Record<Answers, number> = { A: 0, B: 1, C: 2, D: 3 };
  const answerComponent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRandomQuestion(null)
    setSelectedTopic(null)
  }, [setRandomQuestion, setSelectedTopic])

  useEffect(() => {
    handleCheckThreeStreak()
  }, [handleCheckThreeStreak]);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    fetchRandomQuestion("math", topic);
  };

  // get images from math and format it properly 
  
  const extractImageUrls = (explanation: string) => {
    const urlRegex = /\[Image:\s*(https?:\/\/[^\]]+)\]/g;
    const urls: string[] = [];
    let match;
    while ((match = urlRegex.exec(explanation)) !== null) {
      urls.push(match[1]); // Push the URL found.
    }
    return urls;
};

  const cleanExplanationText = (explanation: string) => {
    return explanation.replace(/\[Image:\s*https?:\/\/[^\]]+\]/g, "");
  };

  const imageUrls = randomQuestion
    ? extractImageUrls(randomQuestion.explanation)
    : [];
  const cleanedExplanation = randomQuestion
    ? cleanExplanationText(randomQuestion.explanation)
    : "";

  return (
    <MainWrappers>
      <Sidebar
        title="Math"
        svg={<MathSVG />}
        topics={mathTopics}
        handleTopicClick={handleTopicClick}
      />

      {/* Main Content */}
      <QuestionWrappers>
        <span className="font-bold text-lg border-2 border-black rounded-lg lg:w-1/5 text-center cursor-pointer hover:bg-black hover:text-white duration-500 mb-10">
          BETA v2.0
        </span>
        {selectedTopic ? (
          <div className="w-full mx-auto">

            <Header
                name={selectedTopic.name}
                question={randomQuestion?.question}
            />
            {randomQuestion ? (
              <MathQuestion
                onAnswerSubmit={() => 
                  handleAnswerSubmit( 
                    "math",
                    randomQuestion.correctAnswer, 
                    answerCorrectRef
                  )
                }
              />
            ) : (
              <Spinner />
            )}
              <Result 
                answerComponent={answerComponent}
                explanation={cleanedExplanation || ""}
                type="math"
                imageUrls={imageUrls}
              />
          </div>
        ) : (
          <GetStarted />
        )}
      </QuestionWrappers>

      <StreakAnnouncer />
    </MainWrappers>
  );
};

export default Math;