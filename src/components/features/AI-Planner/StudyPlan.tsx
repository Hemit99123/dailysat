"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/features/AI-Planner/Calendar"
import axios from "axios"

interface Activity {
  topic: string
  description: string
  duration: number
  type: "review" | "practice" | "lecture" | string // expand if needed
}

interface StudyDay {
  date?: string
  activities: Activity[]
}

interface ValidPlan {
  isDebug?: false
  isError?: false
  days: StudyDay[]
}

interface DebugPlan {
  isDebug: true
  rawResponse: string
}

interface ErrorPlan {
  isError: true
  error: string
  rawResponse?: string
}

type StudyPlanData = ValidPlan | DebugPlan | ErrorPlan

export interface StudyPlanProps {
  plan: StudyPlanData 
  currentScore: string
  targetScore: string
  testDate: Date | undefined
}

export function StudyPlan({ plan, currentScore, targetScore, testDate }: StudyPlanProps) {
  const [view, setView] = useState<"list" | "calendar">("calendar")
  const [isSavedPlan, setSavedPlan] = useState(false)
  const daysUntilTest = testDate ? Math.ceil((testDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

  if ("isDebug" in plan && plan.isDebug) {
    return (
      <div className="border rounded-md shadow-sm bg-white">
        <div className="border-b px-4 py-3 bg-gray-100">
          <h2 className="text-lg font-semibold">Raw Response from Groq (Debug Mode)</h2>
          <p className="text-sm text-gray-500">This is the raw response from the AI model for debugging purposes.</p>
        </div>
        <div className="p-4 max-h-[600px] overflow-auto text-xs whitespace-pre-wrap bg-gray-50">
          <pre>{plan.rawResponse}</pre>
        </div>
      </div>
    )
  }

  if ("isError" in plan && plan.isError) {
    return (
      <div className="border rounded-md shadow-sm bg-white">
        <div className="border-b px-4 py-3 bg-red-100">
          <h2 className="text-lg font-semibold text-red-600">Error Generating Study Plan</h2>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-300 p-3 rounded text-sm text-red-700">
            <strong>Error:</strong> {plan.error}
          </div>
          {plan.rawResponse && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Raw Response (for debugging):</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] border text-xs whitespace-pre-wrap">
                <pre>{plan.rawResponse}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!plan || !plan.days) {
    return (
      <div className="border rounded-md shadow-sm bg-white">
        <div className="border-b px-4 py-3 bg-gray-100">
          <h2 className="text-lg font-semibold">No Study Plan Available</h2>
        </div>
        <div className="p-4">
          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-sm text-yellow-800">
            <strong>No Data:</strong> No study plan data is available. Please try again.
          </div>
        </div>
      </div>
    )
  }

  const handleSavePlan = async () => {
    await axios.post("/api/study-plan", {
      plan
    })

    setSavedPlan(true)
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-md shadow-sm bg-white">
        <div className="border-b px-4 py-3 bg-gray-100">
          <h2 className="text-lg font-semibold">Your Personalized Study Plan</h2>
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <span className="border px-2 py-1 rounded">Current Score: {currentScore}</span>
            <span className="border px-2 py-1 rounded">Target Score: {targetScore}</span>
            <span className="border px-2 py-1 rounded">
              Test Date: {testDate ? format(testDate, "MMM d, yyyy") : "N/A"}
            </span>
            <span className="border px-2 py-1 rounded">{daysUntilTest} days remaining</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-2 rounded ${
                view === "calendar" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded ${
                view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              List View
            </button>

            <button 
              onClick={handleSavePlan}
              className={"px-4 py-2 rounded bg-blue-200"}
              disabled={isSavedPlan}
            >
              Save Plan
            </button>
          </div>

          {view === "calendar" && (
            <div>
              <Calendar 
                plan={plan}
              />
            </div>
          )}

          {view === "list" && (
            <div className="space-y-4">
              {plan.days.map((day, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b font-medium">
                    Day {index + 1}:{" "}
                    {day.date ? format(new Date(day.date), "EEEE, MMMM d") : `Day ${index + 1}`}
                  </div>
                  <div className="p-4">
                    {day.activities && day.activities.length > 0 ? (
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className={`flex justify-between items-start gap-3 p-3 rounded-md border text-sm ${
                              activity.type === "review"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{activity.topic}</div>
                              <div className="text-gray-500">{activity.description}</div>
                            </div>
                            <div className="text-gray-500 whitespace-nowrap">{activity.duration} min</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No activities scheduled for this day.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
