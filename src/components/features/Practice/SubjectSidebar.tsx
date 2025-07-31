"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  SquareSigma,
  ArrowRight,
} from "lucide-react";
import { Type } from "@/types/practice/subject";
import SubjectButton from "./SubjectButton";
import { DIFFICULTY_META } from "@/data/difficulty-meta";

export interface SubjectSidebarProps {
  subject: Capitalize<Type>;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  subjects: string[];
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  setDifficulty: (diff: "All" | "Easy" | "Medium" | "Hard") => void;
}

const SubjectSidebar: React.FC<SubjectSidebarProps> = ({
  subject,
  selectedTopic,
  setSelectedTopic,
  difficulty,
  subjects,
  setDifficulty,
}) => {
  const otherSubject = subject === "Math" ? "English" : "Math";
  const switchHref = `/practice/${otherSubject.toLowerCase()}`;

  return (
    <aside className="w-full md:w-[250px] space-y-6 rounded-lg bg-slate-50 p-5 shadow mb-5 md:mb-0">
      {/* Subject Header */}
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        {subject === "Math" ? <SquareSigma className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        {subject}
      </h2>

      {/* Subject Switch */}
      <Link
        href={switchHref}
        className="flex items-center justify-center gap-1 rounded border border-blue-600 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 shadow hover:bg-blue-100"
      >
        Go to {otherSubject}
        <ArrowRight size={12} />
      </Link>

      <hr className="border-slate-300" />

      {/* Topic Selection */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-600">Subjects:</h3>
        <div className="flex flex-col gap-2">
        {subjects.map((subject, index) => {
          const isActive = selectedTopic === subject;
          return (
            <SubjectButton 
              key={index}
              subject={subject} 
              isActive={isActive} 
              setSelectedTopic={setSelectedTopic}
            />
          );
        })}
        </div>
      </section>

      {/* Difficulty Selection */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-600">Choose Difficulty:</h3>
        <div className="flex gap-3">
          {(Object.keys(DIFFICULTY_META) as SubjectSidebarProps["difficulty"][]).map((diff) => {
            const meta = DIFFICULTY_META[diff];
            const isActive = difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                title={meta.tooltip}
                className={`flex h-10 w-10 items-center justify-center rounded-full border font-medium shadow transition-all ${
                  isActive ? "border-blue-600" : "border-slate-300"
                } ${meta.bg}`}
              >
                <span className="text-lg">{meta.emoji}</span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default SubjectSidebar;