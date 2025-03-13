"use client"

import type { Question } from "./types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuestionComponentProps {
  question: Question
  selectedChoice: string | null
  isCorrect: boolean | null
  showHint: boolean
  attempts: number
  onSelectChoice: (choiceId: string) => void
  onTryAgain: () => void
  onShowHint: () => void
}

export function QuestionComponent({
  question,
  selectedChoice,
  isCorrect,
  showHint,
  attempts,
  onSelectChoice,
  onTryAgain,
  onShowHint,
}: QuestionComponentProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="font-semibold text-lg mb-4">{question.text}</h3>

      <div className="space-y-3 mb-4">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => !selectedChoice && onSelectChoice(choice.id)}
            disabled={selectedChoice !== null}
            className={cn(
              "w-full text-left p-3 rounded-md border transition-colors",
              selectedChoice === choice.id && choice.correct && "border-green-500 bg-green-50",
              selectedChoice === choice.id && !choice.correct && "border-red-500 bg-red-50",
              !selectedChoice && "hover:bg-muted",
            )}
          >
            <span className="font-medium mr-2">{choice.id}.</span>
            {choice.text}
          </button>
        ))}
      </div>

      {selectedChoice && isCorrect === false && (
        <div className="mb-4">
          <Button onClick={onTryAgain} variant="outline" className="mr-2">
            Try Again
          </Button>

          {attempts >= 1 && !showHint && (
            <Button onClick={onShowHint} variant="ghost">
              Hint
            </Button>
          )}
        </div>
      )}

      {showHint && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
          <p className="text-amber-800 text-sm">{question.hint}</p>
        </div>
      )}

      {selectedChoice && isCorrect && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-md">
          <p className="text-green-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

