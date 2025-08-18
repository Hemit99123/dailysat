"use client";


import type React from "react"
import { useState } from "react"
import { generateStudyPlan } from "@/lib/ai/generateStudyPlan"
import { StudyPlan } from "@/components/features/AI-Planner/StudyPlan"
import { StudyPlanData, StudyDay, DebugPlan, ValidPlan } from "@/types/ai-planner/ai"
import {toast} from "react-toastify"

const AI = () => {
  const [currentScore, setCurrentScore] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [testDate, setTestDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [personalization, setPersonalization] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScore || !targetScore || !testDate) return;

    setIsLoading(true);

    try {
      const plan = await generateStudyPlan({
        currentScore: Number(currentScore),
        targetScore: Number(targetScore),
        testDate: new Date(testDate).toISOString(),
        debug: false,
        personalization,
      });

      if (plan?.isDebug && "rawResponse" in plan) {
        try {
          const jsonMatch = plan.rawResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedPlan = JSON.parse(jsonMatch[0]);
            const currentDate = new Date();
            parsedPlan.days = parsedPlan.days.map(
              (day: StudyDay, index: number) => {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + index);
                return { ...day, date: date.toISOString().split("T")[0] };
              }
            );
            setStudyPlan({
              ...parsedPlan,
              rawResponse: plan.rawResponse,
              isDebug: true,
            } as DebugPlan & ValidPlan);
          } else {
            setStudyPlan(plan);
          }
        } catch (err) {
          // You need to use the variable, and the only way to do so is to use console.error
          toast.error(`Sorry, it looks like there is an error: ${err}`);

          setStudyPlan(plan);
        }
      } else {
        setStudyPlan(plan);
      }

      setStep(2);
    } catch (error) {
      setStudyPlan({
        error: `Failed to generate plan. Error message: ${error as Error}`,
        isError: true,
      });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentScore("");
    setTargetScore("");
    setTestDate("");
    setStudyPlan(null);
    setStep(1);
  };

  return (
    <div>
      {step === 1 ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">
                Create Your SAT Study Plan
              </h2>
            </div>
            <p className="text-gray-600">
              Enter your current score, target score, and test date to generate
              a personalized study plan.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="current-score"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current SAT Score
                </label>
                <input
                  id="current-score"
                  type="number"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(e.target.value)}
                  min={400}
                  max={1600}
                  required
                  placeholder="Enter your current score (400-1600)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="target-score"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target SAT Score
                </label>
                <input
                  id="target-score"
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  min={400}
                  max={1600}
                  required
                  placeholder="Enter your target score (400-1600)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="personalization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Personalize Your Plan
                </label>
                <textarea
                  id="personalization"
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  placeholder="Tell us about your strengths, weaknesses, and study preferences"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                />
              </div>

              <div>
                <label
                  htmlFor="test-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Test Date
                </label>
                <input
                  id="test-date"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                  min={new Date(Date.now()).toISOString().split("T")[0]}
                  max={
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating your plan...
                  </div>
                ) : (
                  "Generate Study Plan"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Form
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <StudyPlan
              plan={studyPlan as StudyPlanData}
              currentScore={currentScore}
              targetScore={targetScore}
              testDate={testDate ? new Date(testDate) : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AI;
