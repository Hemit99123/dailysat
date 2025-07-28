"use client";

import { useEffect, useState, useMemo } from "react";
import parse from "html-react-parser";

import { TopicSidebar } from "@/components/features/Practice/TopicSidebar";
import { QuestionContent } from "@/components/features/Practice/QuestionContent";
import ScoreAndProgress from "@/components/features/Practice/ScoreAndProgress";

import {
  usePracticeSession,
  QuestionHistory,
} from "@/hooks/useEnglishPracticeSession";

import { subject, domainDisplayMapping } from "@/data/practice/practice";

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
    questionHistory,
    setQuestionHistory,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    showNext,
  } = usePracticeSession();

  const [interaction, setInteraction] =
    useState<InteractionState>(INITIAL_INTERACTION);

  const resetInteraction = (preserveAnswer = false) =>
    setInteraction(prev => ({
      ...INITIAL_INTERACTION,
      selectedAnswer: preserveAnswer ? prev.selectedAnswer : null,
    }));

  useEffect(() => {
    const keepAnswer =
      currentHistoryIndex !== null &&
      questionHistory[currentHistoryIndex]?.isAnswered;

    resetInteraction(keepAnswer);
  }, [currentQuestion]);

  const currentQuestionStatus = useMemo(
    () => questionHistory.find(h => h.question.id === currentQuestion?.id),
    [currentQuestion, questionHistory],
  );

  const isViewingAnsweredHistory = useMemo(
    () =>
      currentHistoryIndex !== null &&
      questionHistory[currentHistoryIndex]?.isAnswered,
    [currentHistoryIndex, questionHistory],
  );

  const renderedQuestionStem = useMemo(() => {
    if (!currentQuestion) return null;

    const rawStem =
      (currentQuestion.question as any).stemHtml ??
      (currentQuestion.question as any).stem ??
      (currentQuestion.question as any).prompt ??
      (currentQuestion.question as any).question ??
      "";

    return rawStem ? parse(rawStem) : null;
  }, [currentQuestion]);

  const handleSubmit = () => {
    if (!interaction.selectedAnswer || !currentQuestion) return;

    const correct =
      interaction.selectedAnswer === currentQuestion.question.correct_answer;

    if (correct) {
      setCorrectCount(c => c + 1);
      setEnglishCorrect(c => c + 1);
      setCurrentStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setWrongCount(c => c + 1);
      setEnglishWrong(c => c + 1);
      setCurrentStreak(0);
    }

    setQuestionHistory(prev => {
      const index = prev.findIndex(h => h.question.id === currentQuestion.id);

      const updatedItem: QuestionHistory = {
        id: index !== -1 ? prev[index].id : prev.length + 1,
        question: currentQuestion,
        userAnswer: interaction.selectedAnswer,
        isCorrect: correct,
        isAnswered: true,
        isMarkedForLater: index !== -1 ? prev[index].isMarkedForLater : false,
      };

      if (index !== -1) {
        return prev.map((h, i) => (i === index ? updatedItem : h));
      }
      return [...prev, updatedItem];
    });

    setInteraction(prev => ({
      ...prev,
      isCorrect: correct,
      isSubmitted: true,
      showExplanation: true,
    }));
  };

  const handleMarkForLater = () => {
    if (!currentQuestion) return;

    setQuestionHistory(prev => {
      const index = prev.findIndex(h => h.question.id === currentQuestion.id);

      if (index !== -1) {
        return prev.map((h, i) =>
          i === index ? { ...h, isMarkedForLater: !h.isMarkedForLater } : h,
        );
      }

      const newItem: QuestionHistory = {
        id: prev.length + 1,
        question: currentQuestion,
        userAnswer: null,
        isCorrect: null,
        isMarkedForLater: true,
        isAnswered: false,
      };

      return [...prev, newItem];
    });
  };

  const handleProgressBoxClick = (index: number) => {
    const historyItem = questionHistory[index];

    setCurrentHistoryIndex(index);
    setCurrentQuestion(historyItem.question);
    setInteraction({
      selectedAnswer: historyItem.userAnswer,
      isCorrect: historyItem.isCorrect,
      isSubmitted: historyItem.isAnswered,
      showExplanation: historyItem.isAnswered,
    });
  };

  const handleNext = () => {
    if (currentHistoryIndex !== null) setCurrentHistoryIndex(null);
    showNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-2 md:gap-6 md:p-5">
      {/* --------------------------- Sidebar --------------------------- */}
      <TopicSidebar
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        currentDomainNames={englishDomains}
        domainDisplayMapping={domainDisplayMapping}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        subject={subject}
      />

      {/* -------------------------- Main Pane --------------------------- */}
      <div className="flex flex-col flex-1 gap-4 md:flex-row md:gap-6">
        <section className="flex-1 overflow-y-auto rounded-lg bg-white p-5 text-black shadow max-h-[calc(100vh-64px)]">

          <QuestionContent
            isMarked={currentQuestionStatus?.isMarkedForLater || false}
            isLoading={isLoading}
            currentQuestion={currentQuestion}
            subject={subject}
            selectedDomain={
              domainDisplayMapping[selectedDomain] || selectedDomain
            }
            handleMarkForLater={handleMarkForLater}
            currentQuestionStatus={currentQuestionStatus || null}
            selectedAnswer={interaction.selectedAnswer}
            isSubmitted={interaction.isSubmitted}
            isViewingAnsweredHistory={isViewingAnsweredHistory}
            handleAnswerSelect={(answer: string) =>
              setInteraction(prev => ({ ...prev, selectedAnswer: answer }))
            }
            isCorrect={interaction.isCorrect}
            handleSubmit={handleSubmit}
            showNext={handleNext}
            showExplanation={interaction.showExplanation}
          />
        </section>

        {/* ---------------------- Stats Sidebar ------------------------- */}
        <aside className="w-full md:w-[250px]">
          <ScoreAndProgress
            correctCount={correctCount}
            wrongCount={wrongCount}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
            predictedScore={predictedEnglishScore}
            questionHistory={questionHistory}
            onProgressBoxClick={handleProgressBoxClick}
            currentQuestion={currentQuestion}
          />
        </aside>
      </div>
    </div>
  );
}
