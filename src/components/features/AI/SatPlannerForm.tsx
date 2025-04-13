"use client"

import { useState } from "react"
import { generateStudyPlan } from "@/lib/ai/generateStudyPlan"
import { StudyPlan } from "./StudyPlan"

export function SatPlannerForm() {
  const [currentScore, setCurrentScore] = useState("")
  const [targetScore, setTargetScore] = useState("")
  const [testDate, setTestDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentScore || !targetScore || !testDate) return

    setIsLoading(true)

    try {
      const plan = await generateStudyPlan({
        currentScore: Number(currentScore),
        targetScore: Number(targetScore),
        testDate: new Date(testDate).toISOString(),
        debug: false,
      })

      // Debug logic
      if (plan?.isDebug && plan.rawResponse) {
        try {
          const jsonMatch = plan.rawResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsedPlan = JSON.parse(jsonMatch[0])
            const currentDate = new Date()
            parsedPlan.days = parsedPlan.days.map((day: any, index: number) => {
              const date = new Date(currentDate)
              date.setDate(currentDate.getDate() + index)
              return { ...day, date: date.toISOString().split("T")[0] }
            })
            setStudyPlan({
              ...parsedPlan,
              rawResponse: plan.rawResponse,
              isDebug: true,
            })
          } else {
            setStudyPlan(plan)
          }
        } catch (err) {
          console.error("Parsing error:", err)
          setStudyPlan(plan)
        }
      } else {
        setStudyPlan(plan)
      }

      setStep(2)
    } catch (error) {
      console.error("Error generating study plan:", error)
      setStudyPlan({ error: "Failed to generate plan", isError: true })
      setStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentScore("")
    setTargetScore("")
    setTestDate("")
    setStudyPlan(null)
    setStep(1)
  }

  return (
    <>
      {step === 1 ? (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
          <h2>Create Your Study Plan</h2>
          <p>Enter your current SAT score, target score, and test date.</p>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="current-score">Current SAT Score:</label><br />
            <input
              id="current-score"
              type="number"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
              min={400}
              max={1600}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="target-score">Target SAT Score:</label><br />
            <input
              id="target-score"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              min={400}
              max={1600}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="test-date">Test Date:</label><br />
            <input
              id="test-date"
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <button type="submit" disabled={isLoading} style={{ padding: "10px 20px" }}>
            {isLoading ? "Generating..." : "Generate Plan"}
          </button>
        </form>
      ) : (
        <div style={{ padding: 20 }}>
          <button onClick={resetForm} style={{ marginBottom: 16 }}>
            ← Back to Form
          </button>
          <StudyPlan plan={studyPlan} currentScore={currentScore} targetScore={targetScore} testDate={testDate ? new Date(testDate) : undefined} />
        </div>
      )}
    </>
  )
}
