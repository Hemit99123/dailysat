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
  isToday as _isToday,
  differenceInDays,
  isFirstDayOfMonth,
  isWeekend
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, BookOpen, BarChart3, Brain, X, Zap, Calendar as CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
      <div className="w-full rounded-xl border shadow-sm bg-white p-6 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <CalendarCheck className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No calendar data available</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There was an issue loading your study plan calendar. Please try again or contact support if the problem persists.
          </p>
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

  // Get activity minutes for a date
  const getActivityMinutes = (date: Date) => {
    const activities = getActivitiesForDate(date)
    return activities.reduce((total: number, activity: any) => total + activity.duration, 0)
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

  // Get days until test
  const getDaysUntilTest = (date: Date) => {
    if (!testDate) return null
    const diff = differenceInDays(testDate, date)
    if (diff < 0) return null
    return diff
  }

  // Get activity icon based on type
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case 'practice':
        return <BarChart3 className="h-5 w-5 text-green-600" />
      case 'lecture':
        return <Brain className="h-5 w-5 text-amber-600" />
      default:
        return <Zap className="h-5 w-5 text-purple-600" />
    }
  }

  // Get activity background color based on type
  const getActivityTypeStyle = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-blue-50 border-blue-100'
      case 'practice':
        return 'bg-green-50 border-green-100'
      case 'lecture':
        return 'bg-amber-50 border-amber-100'
      default:
        return 'bg-purple-50 border-purple-100'
    }
  }

  return (
    <div className="w-full rounded-xl border shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Study Calendar</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center justify-center rounded-full w-9 h-9 border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
              onClick={previousMonth}
              title="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="flex items-center justify-center rounded-xl px-4 h-9 border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm font-medium"
              onClick={today}
            >
              Today
            </button>
            <button
              className="flex items-center justify-center rounded-full w-9 h-9 border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
              onClick={nextMonth}
              title="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="text-lg font-bold text-gray-800">{format(currentMonth, "MMMM yyyy")}</div>
          
          {testDate && (
            <div className="flex items-center gap-2 text-sm bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-red-700">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">
                Test Date: {format(testDate, "MMMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-5">
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div key={day} className={`font-medium py-2 rounded-lg text-sm ${i === 0 || i === 6 ? 'text-red-500' : 'text-gray-700'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, i) => {
            // Get activities for this day
            const dayActivities = getActivitiesForDate(day)
            const activityTypes = getActivityTypes(day)
            const isToday = _isToday(day)
            const isTestDay = testDate && isSameDay(day, testDate)
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            const daysUntilTest = getDaysUntilTest(day)
            const activityMinutes = getActivityMinutes(day)
            const isWeekendDay = isWeekend(day)
            const isFirstDay = isFirstDayOfMonth(day)

            return (
              <button
                key={i}
                className={cn(
                  "h-24 w-full p-1 font-normal relative rounded-xl transition-all duration-150 border",
                  !isSameMonth(day, currentMonth) && "text-gray-300 border-transparent bg-gray-50/30",
                  isToday && "border-amber-300 bg-amber-50 font-medium ring-2 ring-amber-200 z-10",
                  isTestDay && "ring-2 ring-red-400 border-red-300 bg-red-50 z-10",
                  isSelected && "border-blue-300 bg-blue-50 ring-2 ring-blue-200 z-10",
                  hasActivities(day) && !isToday && !isTestDay && !isSelected && "border-blue-200 shadow-sm",
                  isWeekendDay && !isToday && !isTestDay && !isSelected && "bg-gray-50/50",
                  hasActivities(day) ? "hover:bg-blue-50/80 cursor-pointer" : "cursor-default",
                )}
                onClick={() => {
                  setSelectedDay(day)
                  openDayDialog(day)
                }}
                disabled={!hasActivities(day)}
              >
                <div className={cn(
                  "absolute top-1 left-1 flex items-center justify-center rounded-lg w-7 h-7 text-sm",
                  isToday ? "font-bold text-amber-700 bg-white/50" : 
                  isTestDay ? "font-bold text-red-700 bg-white/50" :
                  isFirstDay ? "font-bold text-blue-600 bg-white/50" :
                  isWeekendDay ? "text-red-500" : "text-gray-700"
                )}>
                  {format(day, "d")}
                </div>
                
                {hasActivities(day) && (
                  <div className="absolute top-1 right-1 flex items-center gap-1 text-xs bg-white px-1.5 py-0.5 rounded-lg shadow-sm border border-blue-100">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-blue-700">{activityMinutes}m</span>
                  </div>
                )}
                
                {daysUntilTest !== null && daysUntilTest <= 7 && daysUntilTest > 0 && (
                  <div className="absolute bottom-1 left-1 text-xs font-medium text-red-600 bg-white/70 px-1.5 py-0.5 rounded-lg border border-red-100">
                    {daysUntilTest}d to test
                  </div>
                )}
                
                {isTestDay && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-red-100 p-1.5 rounded-xl">
                      <CalendarIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-xs font-bold text-red-600 mt-1 bg-white/80 px-2 py-0.5 rounded-lg">Test Day</span>
                  </div>
                )}
                
                {hasActivities(day) && (
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    {activityTypes.includes("review") && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    )}
                    {activityTypes.includes("practice") && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    )}
                    {activityTypes.includes("lecture") && (
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                    )}
                    {activityTypes.some(t => !["review", "practice", "lecture"].includes(t.toString())) && (
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-5 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Practice</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>Lecture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span>Other Activities</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <CalendarIcon className="h-3 w-3 text-red-500" />
            <span>Test Day</span>
          </div>
        </div>
      </div>

      {/* Custom Dialog */}
      <AnimatePresence>
        {isDialogOpen && dialogDay && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" 
            onClick={closeDialog}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-6 py-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {format(dialogDay, "EEEE, MMMM d, yyyy")}
                    </h3>
                  </div>
                  <button 
                    onClick={closeDialog} 
                    className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 flex gap-5">
                  <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10 backdrop-blur-sm">
                    <div className="text-xs text-blue-100 mb-1">Activities</div>
                    <div className="text-xl font-bold">
                      {getActivitiesForDate(dialogDay).length}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10 backdrop-blur-sm">
                    <div className="text-xs text-blue-100 mb-1">Total Time</div>
                    <div className="text-xl font-bold">
                      {getActivityMinutes(dialogDay)} min
                    </div>
                  </div>
                  
                  {getDaysUntilTest(dialogDay) !== null && (
                    <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10 backdrop-blur-sm ml-auto">
                      <div className="text-xs text-blue-100 mb-1">Test Countdown</div>
                      <div className="text-xl font-bold">
                        {getDaysUntilTest(dialogDay)} days
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="overflow-y-auto flex-grow p-6">
                <div className="space-y-4">
                  {getActivitiesForDate(dialogDay).map((activity: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "rounded-xl border shadow-sm overflow-hidden",
                        getActivityTypeStyle(activity.type)
                      )}
                    >
                      <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === "review" ? "bg-blue-100" :
                            activity.type === "practice" ? "bg-green-100" :
                            activity.type === "lecture" ? "bg-amber-100" :
                            "bg-purple-100"
                          }`}>
                            {getActivityTypeIcon(activity.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{activity.topic}</div>
                            <div className="text-xs uppercase tracking-wider font-medium text-gray-500">
                              {activity.type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          {activity.duration} minutes
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white bg-opacity-50">
                        <p className="text-gray-700">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
