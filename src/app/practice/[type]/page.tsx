"use client";

import React, { Suspense, useState } from "react";
import SubjectSidebar from "@/components/features/Practice/SubjectSidebar";
import QuestionContent from "@/components/features/Practice/QuestionContent";
import SessionProgress from "@/components/features/Practice/SessionProgress";
import { englishSubjectsArray, mathSubjectsArray } from "@/data/subject";
import { Difficulty } from "@/types/practice/difficulty";
import { EnglishSubjects, Type } from "@/types/practice/subject";
import { useParams } from "next/navigation";

const PracticePage = () => {
  const params = useParams();
  const { type } = params;

  if (type !== "math" && type !== "english") {
    throw new Error("Proper slug is not provided. Try again.");
  }

  const [selectedTopic, setSelectedTopic] = useState<EnglishSubjects>("All");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  if (!type) {
    throw new Error("Type query parameter is required");
  }

  const handleAnswered = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const updated = prev + 1;
        setMaxStreak((max) => Math.max(max, updated));
        return updated;
      });
    } else {
      setWrongCount((prev) => prev + 1);
      setCurrentStreak(0);
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-6 px-4 md:px-10 py-6">
      {/* Sidebar */}
      <aside className="w-full md:w-72 rounded-md p-4 overflow-y-auto">
        <SubjectSidebar
          subject={type === "math" ? "Math" : "English"}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          subjects={type === "math" ? mathSubjectsArray : englishSubjectsArray}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      </aside>

      {/* Question Content */}
      <main className="flex-1 flex flex-col space-y-8">
        <div className="rounded-md p-6 flex-grow overflow-auto">
          <QuestionContent
            subject={selectedTopic}
            difficulty={difficulty}
            type={type as Type}
            onAnswered={handleAnswered}
          />
        </div>
      </main>

      {/* Score Panel */}
      <aside className="w-full md:w-72 rounded-md p-4 overflow-y-auto">
        <SessionProgress
          correctCount={correctCount}
          wrongCount={wrongCount}
          currentStreak={currentStreak}
          maxStreak={maxStreak}
        />
      </aside>
    </div>
  );
};

export default PracticePage;
