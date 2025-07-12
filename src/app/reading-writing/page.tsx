"use client";

import Sidebar from "@/components/features/Sidebar/Sidebar";
import { readingTopics } from "@/data/topics";
import { Book } from "lucide-react";
import { Topic } from "@/types/sat-platform/topic";
import { useEffect, useRef } from "react";
import ReadingQuestion from "@/components/features/Questions/Question-UI/QuestionModules/ReadingQuestion";
import Header from "@/components/features/Questions/Question-UI/Header";
import { useAnswerCounterStore } from "@/store/score";
import { useStreakAnnouncerModalStore } from "@/store/modals";
import StreakAnnouncer from "@/components/features/Questions/Modals/StreakAnnouncer";
import useQuestionHandler from "@/hooks/questions";
import Spinner from "@/components/common/Spinner";
import GetStarted from "@/components/features/Questions/Question-UI/GetStarted";
import Result from "@/components/features/Questions/Question-UI/Results";
import { useQuestionStore, useTopicStore } from "@/store/questions";
import QuestionWrappers from "@/components/wrappers/Question";
import MainWrappers from "@/components/wrappers/Main";

const Reading = () => {
  const { fetchRandomQuestion, handleAnswerSubmit, handleCheckThreeStreak } = useQuestionHandler();
  const selectedTopic = useTopicStore((state) => state.selectedTopic)
  const setSelectedTopic = useTopicStore((state) => state.setSelectedTopic)
  const randomQuestion = useQuestionStore((state) => state.randomQuestion);
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion)
  
  const correctCount = useAnswerCounterStore((state) => state.count);

  const isAnnouncerModalOpen = useStreakAnnouncerModalStore((state) => state.isOpen);

  const answerComponent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRandomQuestion(null)
    setSelectedTopic(null)
  }, [setRandomQuestion, setSelectedTopic])

  useEffect(() => {
    handleCheckThreeStreak();

  }, [correctCount, handleCheckThreeStreak]);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    fetchRandomQuestion("reading-writing", topic);
  };

  return (
    <MainWrappers>
      <Sidebar
        title="Reading & Writing"
        svg={<Book />}
        topics={readingTopics}
        handleTopicClick={handleTopicClick}
      />

      {/* Main Content */}
      <QuestionWrappers>
        {selectedTopic ? (
            <div className="w-full mx-auto">
            <Header
              name={selectedTopic.name}
              question={randomQuestion?.question}
            />
            {randomQuestion ? (
              <ReadingQuestion
              onAnswerSubmit={() =>
                handleAnswerSubmit(
                "reading-writing",
                )
              }
              moveToNextQuestion={() => {
                // Logic to move to the next question
                fetchRandomQuestion("reading-writing", selectedTopic);
              }}
              />
            ) : (
              <Spinner />
            )}
            <Result
              answerComponent={answerComponent}
              explanation={randomQuestion?.explanation || ""}
              type="reading-writing"
            />
            </div>
        ) : (
          <GetStarted />
        )}
      </QuestionWrappers>

      {isAnnouncerModalOpen && <StreakAnnouncer />}
    </MainWrappers>
  );
};

export default Reading;
