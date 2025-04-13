/* eslint-disable */

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
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  plan: any
  testDate?: Date
}

export function Calendar({ plan, testDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogDay, setDialogDay] = useState<Date | null>(null)

  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    return (
      <div className="w-full rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">No calendar data available</h3>
        </div>
      </div>
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

  // Get activity types for a date
  const getActivityTypes = (date: Date) => {
    const activities = getActivitiesForDate(date)
    const types = new Set(activities.map((a: any) => a.type))
    return Array.from(types)
  }

  // Open dialog for a specific day
  const openDayDialog = (day: Date) => {
    if (hasActivities(day)) {
      setDialogDay(day)
      setIsDialogOpen(true)
    }
  }

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className="w-full rounded-lg border shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Study Calendar</h3>
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={today}
            >
              Today
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">{format(currentMonth, "MMMM yyyy")}</div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
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
              <button
                key={i}
                className={cn(
                  "h-12 w-full p-0 font-normal relative rounded-md",
                  !isSameMonth(day, currentMonth) && "text-gray-400 opacity-50",
                  isToday && "bg-amber-50 font-medium",
                  isTestDay && "border-2 border-red-500",
                  isSelected && "bg-blue-50",
                  hasActivities(day) && "font-medium",
                  hasActivities(day) ? "hover:bg-gray-100" : "cursor-default",
                )}
                onClick={() => {
                  setSelectedDay(day)
                  openDayDialog(day)
                }}
                disabled={!hasActivities(day)}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                {hasActivities(day) && (
                  <div className="absolute bottom-1 right-1 flex space-x-0.5">
                    {activityTypes.includes("review") && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                    {activityTypes.includes("practice") && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                  </div>
                )}
                {isTestDay && (
                  <span className="absolute top-1 right-1">
                    <CalendarIcon className="h-3 w-3 text-red-500" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Dialog */}
      {isDialogOpen && dialogDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeDialog}>
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b pb-2 px-6 pt-6">
              <h3 className="text-lg font-semibold">Study Plan for {format(dialogDay, "EEEE, MMMM d, yyyy")}</h3>
            </div>
            <div className="overflow-y-auto max-h-[60vh] mt-4 px-6">
              <div className="space-y-3 pr-4 pb-6">
                {getActivitiesForDate(dialogDay).map((activity: any, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-md border",
                      activity.type === "review" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200",
                    )}
                  >
                    {activity.type === "review" && <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />}
                    {activity.type === "practice" && <BarChart className="h-5 w-5 text-green-600 mt-0.5" />}
                    <div className="flex-1">
                      <div className="font-medium">{activity.topic}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {activity.duration} min
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
