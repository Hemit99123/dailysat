"use client";

import { useState, useEffect, useMemo } from "react";
import { TopicSidebar } from "@/components/practice/TopicSidebar";
import { QuestionContent } from "@/components/practice/QuestionContent";
import ScoreAndProgress from "@/components/practice/ScoreAndProgress";
import { useVocabPracticeSession } from "@/hooks/useVocabPracticeSession";

interface Interaction {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showExplanation: boolean;
  isSubmitted: boolean;
}

const INITIAL_INTERACTION: Interaction = {
  selectedAnswer: null,
  isCorrect: null,
  showExplanation: false,
  isSubmitted: false,
};

export default function VocabPracticePage() {
  const { currentQuestion, generateQuestion, isLoading } = useVocabPracticeSession();

  const [interaction, setInteraction] = useState<Interaction>(INITIAL_INTERACTION);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  // ---- Adapt vocab question to the math Question shape expected by UI components ----
  const adaptedQuestion = useMemo(() => {
    if (!currentQuestion) return null;

    const fullSentence = currentQuestion.question;
    const match = fullSentence.match(/\(([^)]+)\)\s*$/);
    const extraExplanation = match ? match[1] : null;
    const trimmedSentence = match ? fullSentence.replace(/\s*\(([^)]+)\)\s*$/, "") : fullSentence;

    return {
      id: currentQuestion.id,
      domain: "Vocab",
      visuals: { type: "none", svg_content: "" },
      question: {
        question: trimmedSentence,
        paragraph: null,
        choices: Object.fromEntries(currentQuestion.choices.map((c: string) => [c, c])),
        explanation: `The correct word was "${currentQuestion.correct_answer}".` + (extraExplanation ? ` (${extraExplanation})` : ""),
        correct_answer: currentQuestion.correct_answer,
      },
      difficulty: "Medium",
    };
  }, [currentQuestion]);

  useEffect(() => {
    setInteraction(INITIAL_INTERACTION);
  }, [currentQuestion]);

  const handleSubmit = () => {
    if (!interaction.selectedAnswer || !currentQuestion || !adaptedQuestion) return;

    const isCorrect = interaction.selectedAnswer === currentQuestion.correct_answer;

    setInteraction(prev => ({
      ...prev,
      isCorrect,
      isSubmitted: true,
      showExplanation: true,
    }));

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setCurrentStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setWrongCount(c => c + 1);
      setCurrentStreak(0);
    }

    setQuestionHistory(prev => [
      ...prev,
      {
        id: prev.length + 1,
        question: adaptedQuestion, // pass the adapted shape
        userAnswer: interaction.selectedAnswer,
        isCorrect,
        isAnswered: true,
        isMarkedForLater: false,
      },
    ]);
  };

  return (
    <div className="flex gap-6 p-5">
      <TopicSidebar
        selectedDomain="All"
        setSelectedDomain={() => {}}
        currentDomainNames={[]}
        domainDisplayMapping={{}}
        difficulty="All"
        setDifficulty={() => {}}
        subject="Vocab"
      />

      <div className="flex flex-1 gap-6">
        <section className="flex-1 overflow-y-auto rounded-lg bg-white p-5 text-black shadow max-h-[calc(100vh-64px)]">
          <QuestionContent
            isMarked={false}
            isLoading={isLoading}
            currentQuestion={adaptedQuestion as any}
            subject="vocab"
            selectedDomain=""
            handleMarkForLater={() => {}}
            currentQuestionStatus={null}
            selectedAnswer={interaction.selectedAnswer}
            isSubmitted={interaction.isSubmitted}
            isViewingAnsweredHistory={false}
            handleAnswerSelect={(answer: string) =>
              setInteraction(prev => ({ ...prev, selectedAnswer: answer }))
            }
            isCorrect={interaction.isCorrect}
            handleSubmit={handleSubmit}
            showNext={generateQuestion}
            showExplanation={interaction.showExplanation}
            showDesmos={false}
            setShowDesmos={() => {}}
          />
        </section>

        <aside className="w-[250px]">
          <ScoreAndProgress
            correctCount={correctCount}
            wrongCount={wrongCount}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
            predictedScore={200 + Math.round((correctCount / Math.max(1, correctCount + wrongCount)) * 600)}
            questionHistory={questionHistory as any}
            onProgressBoxClick={() => {}}
            currentQuestion={adaptedQuestion as any}
          />
        </aside>
      </div>
    </div>
  );
}
