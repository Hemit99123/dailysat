"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
} from "lucide-react";
import { IconProgress } from "@tabler/icons-react";

interface SessionProgressProps {
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  maxStreak: number;
}

const SessionProgress: React.FC<SessionProgressProps> = ({
  correctCount,
  wrongCount,
  currentStreak,
  maxStreak
}) => {
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 0 : (correctCount / totalAttempts) * 100;

  return (
      <div
    >
      <div
      className="flex w-full rounded-t-lg items-center justify-between bg-blue-200 px-4 py-2 text-left text-sm font-bold text-slate-900"
      >
      <span className="flex items-center gap-2">
        <IconProgress size={16} className="text-blue-800" />
        Progress
      </span>
    </div>
        <div className="space-y-4 px-4 py-4 text-slate-900">
          <div className="text-center text-3xl font-bold text-blue-600">
            {accuracy.toFixed(1)}%
          </div>

            
              {/* Stats row */}
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct:
                  <strong>{correctCount}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" /> Incorrect:
                  <strong>{wrongCount}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-600" /> Streak:
                  <strong>{currentStreak}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-indigo-600" /> Max Streak:
                  <strong>{maxStreak}</strong>
                </span>
              </div>

              {/* Accuracy bar */}
              {totalAttempts === 0 ? (
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-300 shadow-inner" />
              ) : (
                <div className="h-4 w-full overflow-hidden rounded-full bg-red-500 shadow-inner">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              )}

              <div className="text-center text-xs">
                Questions Answered: <strong>{totalAttempts}</strong>
              </div>          
        </div>
      </div>
  );
};

export default SessionProgress;
