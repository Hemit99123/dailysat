"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, BookOpen, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  plan: any
  testDate?: Date
}

export function CalendarView({ plan, testDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No calendar data available</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  // Process plan data into a map of date strings to activities
  const activitiesByDate = new Map()

  plan.days.forEach((day: any) => {
    if (day.date && day.activities && Array.isArray(day.activities)) {
      activitiesByDate.set(day.date, day.activities)
    }
  })

  // Get days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Navigation functions
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const today = () => setCurrentMonth(new Date())

  // Get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return activitiesByDate.get(dateString) || []
  }

  // Check if a date has activities
  const hasActivities = (date: Date) => {
    const activities = getActivitiesForDate(date)
    return activities.length > 0
  }

  // Get the count of activities for a date
  const getActivityCount = (date: Date) => {
    const activities = getActivitiesForDate(date)
    return activities.length
  }

  // Get activity types for a date
  const getActivityTypes = (date: Date) => {
    const activities = getActivitiesForDate(date)
    const types = new Set(activities.map((a: any) => a.type))
    return Array.from(types)
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle>Study Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={today}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1">{format(currentMonth, "MMMM yyyy")}</div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, i) => {
            // Get activities for this day
            const dayActivities = getActivitiesForDate(day)
            const activityTypes = getActivityTypes(day)
            const isToday = isSameDay(day, new Date())
            const isTestDay = testDate && isSameDay(day, testDate)
            const isSelected = selectedDay && isSameDay(day, selectedDay)

            return (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-12 w-full p-0 font-normal relative",
                      !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                      isToday && "bg-amber-50 font-medium",
                      isTestDay && "border-2 border-red-500",
                      isSelected && "bg-blue-50",
                      hasActivities(day) && "font-medium",
                    )}
                    onClick={() => setSelectedDay(day)}
                    disabled={!hasActivities(day)}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    {hasActivities(day) && (
                      <div className="absolute bottom-1 right-1 flex space-x-0.5">
                        {activityTypes.includes("review") && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                        {activityTypes.includes("practice") && (
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    )}
                    {isTestDay && (
                      <span className="absolute top-1 right-1">
                        <CalendarIcon className="h-3 w-3 text-red-500" />
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                {hasActivities(day) && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="border-b pb-2">
                      <DialogTitle>Study Plan for {format(day, "EEEE, MMMM d, yyyy")}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] mt-4">
                      <div className="space-y-3 pr-4">
                        {dayActivities.map((activity: any, index: number) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-md border",
                              activity.type === "review"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-green-50 border-green-200",
                            )}
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
                    </ScrollArea>
                  </DialogContent>
                )}
              </Dialog>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

