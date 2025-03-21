"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, BookOpen, BarChart, AlertTriangle, List, CalendarDays } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "./calendar-view"

interface StudyPlanProps {
  plan: any
  currentScore: string
  targetScore: string
  testDate: Date | undefined
}

export function StudyPlan({ plan, currentScore, targetScore, testDate }: StudyPlanProps) {
  const [view, setView] = useState<"list" | "calendar">("calendar")
  const daysUntilTest = testDate ? Math.ceil((testDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

  // Handle debug mode
  if (plan?.isDebug) {
    return (
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Raw Response from Groq (Debug Mode)</CardTitle>
          <CardDescription>This is the raw response from the AI model for debugging purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[600px] border">
            <pre className="text-xs whitespace-pre-wrap">{plan.rawResponse}</pre>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle error
  if (plan?.isError) {
    return (
      <Card>
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="text-red-500">Error Generating Study Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{plan.error}</AlertDescription>
          </Alert>

          {plan.rawResponse && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Raw Response (for debugging):</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] border">
                <pre className="text-xs whitespace-pre-wrap">{plan.rawResponse}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Handle missing plan
  if (!plan || !plan.days) {
    return (
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>No Study Plan Available</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>No study plan data is available. Please try again.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Display the plan
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Your Personalized Study Plan</CardTitle>
          <CardDescription className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-sm">
                Current Score: {currentScore}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Target Score: {targetScore}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Test Date: {testDate ? format(testDate, "MMM d, yyyy") : "N/A"}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {daysUntilTest} days remaining
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="calendar" onClick={() => setView("calendar")}>
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setView("list")}>
                <List className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-0">
              <CalendarView plan={plan} testDate={testDate} />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {plan.days.map((day: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="font-medium">
                        Day {index + 1}: {day.date ? format(new Date(day.date), "EEEE, MMMM d") : `Day ${index + 1}`}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {day.activities && day.activities.length > 0 ? (
                        <div className="space-y-3">
                          {day.activities.map((activity: any, actIndex: number) => (
                            <div
                              key={actIndex}
                              className={`flex items-start gap-3 p-3 rounded-md border ${
                                activity.type === "review"
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-green-50 border-green-200"
                              }`}
                            >
                              {activity.type === "review" && <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />}
                              {activity.type === "practice" && <BarChart className="h-5 w-5 text-green-600 mt-0.5" />}
                              <div className="flex-1">
                                <div className="font-medium">{activity.topic}</div>
                                <div className="text-sm text-muted-foreground">{activity.description}</div>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {activity.duration} min
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">No activities scheduled for this day.</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

