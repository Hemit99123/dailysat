"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { generateStudyPlan } from "@/app/plan/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { StudyPlan } from "./study-plan"

export function SatPlannerForm() {
  const [currentScore, setCurrentScore] = useState("")
  const [targetScore, setTargetScore] = useState("")
  const [testDate, setTestDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  interface StudyPlanType {
    days?: { date: string; tasks: string[] }[];
    rawResponse?: string;
    isDebug?: boolean;
    error?: string;
    isError?: boolean;
  }

  const [studyPlan, setStudyPlan] = useState<StudyPlanType | null>(null)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentScore || !targetScore || !testDate) {
      return
    }

    setIsLoading(true)

    try {
      const plan = await generateStudyPlan({
        currentScore: Number.parseInt(currentScore),
        targetScore: Number.parseInt(targetScore),
        testDate: testDate.toISOString(),
        debug: false, // Set to true for debugging, false for normal operation
      })

      // If we get a raw response in debug mode, try to parse it for display
      if (plan?.isDebug && plan.rawResponse) {
        try {
          // Try to extract and parse JSON from the response
          const jsonMatch = plan.rawResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsedPlan = JSON.parse(jsonMatch[0])
            // Process dates
            if (parsedPlan.days) {
              const currentDate = new Date()
              parsedPlan.days = parsedPlan.days.map((day: { date: string; tasks: string[] }, index: number) => {
                const dayDate = new Date(currentDate)
                dayDate.setDate(currentDate.getDate() + index)
                return {
                  ...day,
                  date: dayDate.toISOString().split("T")[0],
                }
              })
            }
            setStudyPlan({
              ...parsedPlan,
              rawResponse: plan.rawResponse,
              isDebug: true,
            })
          } else {
            setStudyPlan(plan)
          }
        } catch (parseError) {
          console.error("Error parsing debug JSON:", parseError)
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
    setTestDate(undefined)
    setStudyPlan(null)
    setStep(1)
  }

  return (
    <>
      {step === 1 ? (
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Create Your Study Plan</CardTitle>
            <CardDescription>
              Enter your current SAT score, target score, and next test date to generate a personalized study plan.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="current-score">Current SAT Score</Label>
                <Input
                  id="current-score"
                  type="number"
                  min="400"
                  max="1600"
                  placeholder="Enter your most recent score (400-1600)"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-score">Target SAT Score</Label>
                <Input
                  id="target-score"
                  type="number"
                  min="400"
                  max="1600"
                  placeholder="Enter your target score (400-1600)"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-date">Next SAT Test Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="test-date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !testDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {testDate ? format(testDate, "PPP") : "Select your next test date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={testDate}
                      onSelect={setTestDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating Plan..." : "Generate Study Plan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={resetForm} className="mb-4">
            ← Back to Form
          </Button>
          <StudyPlan plan={studyPlan} currentScore={currentScore} targetScore={targetScore} testDate={testDate} />
        </div>
      )}
    </>
  )
}

