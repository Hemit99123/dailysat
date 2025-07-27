"use client";

import { useEffect, useState, useMemo } from "react";
import parse from "html-react-parser";

import { TopicSidebar } from "@/components/features/Practice/TopicSidebar";
import { QuestionContent } from "@/components/features/Practice/QuestionContent";
import Score from "@/components/features/Practice/Score";

import { usePracticeSession } from "@/hooks/useEnglishPracticeSession";

import { subject, domainDisplayMapping } from "@/data/practice";

interface InteractionState {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showExplanation: boolean;
  isSubmitted: boolean;
}

const INITIAL_INTERACTION: InteractionState = {
  selectedAnswer: null,
  isCorrect: null,
  showExplanation: false,
  isSubmitted: false,
};

export default function EnglishPracticePage() {
  const {
    difficulty,
    setDifficulty,
    selectedDomain,
    setSelectedDomain,
    englishDomains,
    currentQuestion,
    setCurrentQuestion,
    isLoading,
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
  } = usePracticeSession();

  const [interaction, setInteraction] = useState(INITIAL_INTERACTION);

  useEffect(() => {
    setInteraction(INITIAL_INTERACTION);
  }, [currentQuestion]);

  const renderedQuestionStem = useMemo(() => {
    if (!currentQuestion?.question) return null;

    const q = currentQuestion.question as any;

    return parse(q.stemHtml ?? q.stem ?? q.prompt ?? q.question ?? "");
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    setInteraction(prev => ({
      ...prev,
      selectedAnswer: answer,
    }));
  };

  const handleSubmit = () => {
    if (!interaction.selectedAnswer || !currentQuestion?.question) return;

    const isCorrect =
      interaction.selectedAnswer === currentQuestion.question.correct_answer;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setEnglishCorrect(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setWrongCount(prev => prev + 1);
      setEnglishWrong(prev => prev + 1);
      setCurrentStreak(0);
    }

    setInteraction(prev => ({
      ...prev,
      isCorrect,
      isSubmitted: true,
      showExplanation: true,
    }));
  };

  const handleNext = () => {
    showNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-2 md:gap-6 md:p-5">
      {/* Sidebar */}
      <TopicSidebar
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        currentDomainNames={englishDomains}
        domainDisplayMapping={domainDisplayMapping}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        subject={subject}
      />

      {/* Main content and stats */}
      <div className="flex flex-col flex-1 gap-4 md:flex-row md:gap-6">
        <section className="flex-1 overflow-y-auto rounded-lg bg-white p-5 text-black shadow max-h-[calc(100vh-64px)]">
          <QuestionContent
            isLoading={isLoading}
            currentQuestion={currentQuestion}
            subject={subject}
            selectedDomain={domainDisplayMapping[selectedDomain] || selectedDomain}
            selectedAnswer={interaction.selectedAnswer}
            isSubmitted={interaction.isSubmitted}
            isCorrect={interaction.isCorrect}
            showExplanation={interaction.showExplanation}
            handleAnswerSelect={handleAnswerSelect}
            handleSubmit={handleSubmit}
            showNext={handleNext}
            />
        </section>

        {/* Score Sidebar */}
        <aside className="w-full md:w-[250px]">
          <Score
            correctCount={correctCount}
            wrongCount={wrongCount}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
          />
        </aside>
      </div>
    </div>
  );
}
