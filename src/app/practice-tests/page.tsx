"use client"

import { useState } from "react"
import { ChevronDown, Pencil, Bookmark, BookmarkCheck, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function QuizInterface() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [markedForReview, setMarkedForReview] = useState(false)
  const [showQuestionPopup, setShowQuestionPopup] = useState(false)

  // Generate 27 random colors for the top bar
  const colors = [
    "bg-blue-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-gray-400",
  ]

  const randomColorSegments = Array.from({ length: 27 }, () => colors[Math.floor(Math.random() * colors.length)])

  // Mock completed questions (for the popup UI)
  const completedQuestions = [1, 3, 5, 8, 12, 15, 20]

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-3 border-b">
        <button className="flex items-center text-gray-700 font-medium">
          Directions <ChevronDown className="h-4 w-4 ml-1" />
        </button>
        <div className="text-center font-medium">31:14</div>
        <div className="w-20"></div> {/* Placeholder for balance */}
      </header>

      {/* Hide button */}
      <div className="flex justify-center my-2">
        <button className="px-3 py-1 text-sm bg-gray-100 rounded-full">Hide</button>
      </div>

      {/* Dotted line with 27 colored segments */}
      <div className="px-4">
        <div className="h-1 border-t border-dashed border-gray-300 flex">
          {randomColorSegments.map((color, index) => (
            <div key={index} className={`h-1 ${color}`} style={{ width: `${100 / 27}%` }}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col md:flex-row">
          {/* Reading passage */}
          <div className="p-4 md:w-1/2">
            <p className="text-sm leading-relaxed text-gray-800">
              Notre Dame Cathedral, a marvel of Gothic architecture, stands as a testament to the grandeur of 
              ecclesiastical past. Its construction began in the 12th century, and it has since witnessed numerous
              historical events and transformations. Despite the ravages of time and the catastrophic fire in 2019, the
              resilience is evident. Restoration works are in progress to bring back its past glory, while
              maintaining the original architectural integrity. The  importance extends beyond its religious
              significance, serving as a symbol of French heritage and a beacon of hope and resilience for the people of
              France.
            </p>
          </div>

          {/* Question section */}
          <div className="p-4 md:w-1/2 border-t md:border-t-0 md:border-l">
            <div className="flex items-start mb-4 justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-black text-white font-bold rounded-full mr-2">
                  1
                </div>
                <button
                  className="flex items-center cursor-pointer"
                  onClick={() => setMarkedForReview(!markedForReview)}
                >
                  {markedForReview ? (
                    <BookmarkCheck className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm ml-1">Mark for Review</span>
                </button>
              </div>

              <button className="flex items-center text-gray-700">
                <Pencil className="h-4 w-4 mr-1" />
                <span className="text-xs">Annotate</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm mb-4">
                Which choice completes the text with the most logical and precise word or phrase?
              </p>

              <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A" id="A" />
                    <Label htmlFor="A" className="font-normal">
                      A: unimaginable
                    </Label>
                  </div>
                  <button className="text-gray-400">
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="B" id="B" />
                    <Label htmlFor="B" className="font-normal">
                      B: unfathomable
                    </Label>
                  </div>
                  <button className="text-gray-400">
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="C" />
                    <Label htmlFor="C" className="font-normal">
                      C: undeniable
                    </Label>
                  </div>
                  <button className="text-gray-400">
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="D" id="D" />
                    <Label htmlFor="D" className="font-normal">
                      D: unbelievable
                    </Label>
                  </div>
                  <button className="text-gray-400">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dotted line */}
      <div className="px-4">
        <div className="h-px border-t border-dashed border-gray-300"></div>
      </div>

      {/* Footer */}
      <footer className="p-3 flex justify-between items-center relative">
        <Button variant="outline" className="px-6">
          Back
        </Button>

        {/* Question counter in the middle */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
          onClick={() => setShowQuestionPopup(!showQuestionPopup)}
        >
          Question 1 of 27
        </div>

        <Button className="px-6 bg-blue-500 hover:bg-blue-600">Next</Button>

        {/* Question popup (only shown when showQuestionPopup is true) */}
        {showQuestionPopup && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-lg p-4 w-80">
            <h3 className="text-sm font-medium mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 27 }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  className={`flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium cursor-pointer
                    ${completedQuestions.includes(num) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}

