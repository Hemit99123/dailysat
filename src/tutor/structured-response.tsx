"use client"

import { useState } from "react"
import type { TutorResponse } from "./types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"

interface StructuredResponseProps {
  response: TutorResponse
}

export function StructuredResponse({ response }: StructuredResponseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)

  // Ensure response and its properties exist with default values
  const safeResponse = {
    basicAnswer: response?.basicAnswer || "No answer provided.",
    followUpQuestion: response?.followUpQuestion || "No follow-up question provided.",
    options: response?.options || { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
    explanation: response?.explanation || "No explanation provided.",
    correctAnswer: response?.correctAnswer || "A",
    hints: response?.hints || { hint1: "No hint available.", hint2: "No hint available.", hint3: "No hint available." },
  }

  const handleOptionSelect = (option: string) => {
    if (!submitted) {
      setSelectedOption(option)
    }
  }

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true)
    }
  }

  const handleNextHint = () => {
    if (currentHint < 3) {
      setCurrentHint(currentHint + 1)
    }
  }

  const handlePrevHint = () => {
    if (currentHint > 1) {
      setCurrentHint(currentHint - 1)
    }
  }

  const handleReset = () => {
    setSelectedOption(null)
    setSubmitted(false)
    setShowExplanation(false)
    setCurrentHint(0)
  }

  const isCorrect = selectedOption === safeResponse.correctAnswer

  return (
    <div className="space-y-6">
      {/* Basic Answer */}
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-foreground">{safeResponse.basicAnswer}</p>
      </div>

      {/* Interactive Q&A Section */}
      <div className="border p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">{safeResponse.followUpQuestion}</h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {Object.entries(safeResponse.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleOptionSelect(key)}
              disabled={submitted}
              className={cn(
                "w-full text-left p-3 rounded-md border transition-colors",
                selectedOption === key && "border-primary bg-primary/5",
                submitted &&
                  selectedOption === key &&
                  key === safeResponse.correctAnswer &&
                  "border-green-500 bg-green-50",
                submitted && selectedOption === key && key !== safeResponse.correctAnswer && "border-red-500 bg-red-50",
                !submitted && !selectedOption && "hover:bg-muted",
              )}
            >
              <span className="font-medium mr-2">{key}.</span>
              {value}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {!submitted && selectedOption && (
            <Button onClick={handleSubmit} className="flex-grow">
              Submit Answer
            </Button>
          )}

          {submitted && (
            <Button onClick={handleReset} variant="outline" className="flex-grow">
              Try Another Question
            </Button>
          )}

          {!submitted && (
            <Button
              onClick={() => setShowExplanation(!showExplanation)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
          )}
        </div>

        {/* Hints Section */}
        {currentHint > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-amber-800">Hint {currentHint} of 3</h4>
              <div className="flex gap-1">
                <Button
                  onClick={handlePrevHint}
                  variant="ghost"
                  size="sm"
                  disabled={currentHint <= 1}
                  className="h-8 w-8 p-0 text-amber-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleNextHint}
                  variant="ghost"
                  size="sm"
                  disabled={currentHint >= 3}
                  className="h-8 w-8 p-0 text-amber-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-amber-800">
              {currentHint === 1 && safeResponse.hints.hint1}
              {currentHint === 2 && safeResponse.hints.hint2}
              {currentHint === 3 && safeResponse.hints.hint3}
            </p>
          </div>
        )}

        {currentHint === 0 && !submitted && (
          <Button
            onClick={() => setCurrentHint(1)}
            variant="ghost"
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 w-full"
          >
            Need a hint?
          </Button>
        )}

        {/* Results & Explanation */}
        {submitted && (
          <div
            className={cn(
              "p-4 rounded-md mt-4",
              isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200",
            )}
          >
            <h4 className={cn("font-medium mb-2", isCorrect ? "text-green-800" : "text-red-800")}>
              {isCorrect ? "Correct! 🎉" : `Incorrect. The correct answer is ${safeResponse.correctAnswer}.`}
            </h4>
            <p className={isCorrect ? "text-green-700" : "text-red-700"}>{safeResponse.explanation}</p>
          </div>
        )}

        {/* Optional Explanation */}
        {showExplanation && !submitted && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
            <p className="text-blue-700">{safeResponse.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

