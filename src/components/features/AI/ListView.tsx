/* eslint-disable */

"use client"

import { useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, BookOpen, BarChart3, Brain, Clock, CalendarDays, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListViewProps {
  plan: any
  testDate?: Date
}

export function ListView({ plan, testDate }: ListViewProps) {
  const [expandedDays, setExpandedDays] = useState<string[]>([])

  if (!plan || !plan.days || !Array.isArray(plan.days)) {
    return (
      <div className="w-full rounded-xl border shadow-sm bg-white p-6 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No list data available</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There was an issue loading your study plan activities. Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
    )
  }

  const toggleDay = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date) 
        : [...prev, date]
    )
  }

  // Sort days by date
  const sortedDays = [...plan.days].sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

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

  // Get background color for activity type
  const getActivityTypeStyle = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-blue-50 border-blue-100 hover:bg-blue-100'
      case 'practice':
        return 'bg-green-50 border-green-100 hover:bg-green-100'
      case 'lecture':
        return 'bg-amber-50 border-amber-100 hover:bg-amber-100'
      default:
        return 'bg-purple-50 border-purple-100 hover:bg-purple-100'
    }
  }

  // Get activity minutes for a day
  const getTotalMinutes = (activities: any[]) => {
    if (!activities || !Array.isArray(activities)) return 0
    return activities.reduce((total, activity) => total + activity.duration, 0)
  }

  // Check if a date is the test date
  const isTestDate = (dateString: string) => {
    if (!testDate || !dateString) return false
    try {
      const date = parseISO(dateString)
      return isSameDay(date, testDate)
    } catch (e) {
      return false
    }
  }

  return (
    <div className="w-full rounded-xl border shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Study Activities</h3>
        </div>
      </div>

      {/* List of Days */}
      <div className="divide-y overflow-hidden">
        {sortedDays.map((day: any, index: number) => {
          if (!day.date || !day.activities || !Array.isArray(day.activities)) return null
          
          const isExpanded = expandedDays.includes(day.date)
          const totalMinutes = getTotalMinutes(day.activities)
          const date = parseISO(day.date)
          const isTest = isTestDate(day.date)
          
          return (
            <div key={day.date} className={cn(
              "transition-colors duration-200",
              isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
            )}>
              <button 
                className="w-full text-left flex justify-between items-center p-4"
                onClick={() => toggleDay(day.date)}
              >
                <div className="flex gap-4 items-center">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center border shadow-sm",
                    isTest ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                  )}>
                    <span className={cn(
                      "text-sm font-bold",
                      isTest ? "text-red-600" : "text-blue-700"
                    )}>
                      {format(date, "MMM")}
                    </span>
                    <span className={cn(
                      "text-xl font-bold leading-none",
                      isTest ? "text-red-600" : "text-gray-800"
                    )}>
                      {format(date, "d")}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {format(date, "EEEE")}
                      {isTest && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Test Day
                        </span>
                      )}
                    </h4>
                    <div className="text-sm text-gray-500">
                      {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} · {totalMinutes} total minutes
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {Array.from(new Set(day.activities.map((a: any) => a.type))).slice(0, 3).map((type, i: number) => (
                      <div 
                        key={`${type}-${i}`} 
                        className={cn(
                          "w-7 h-7 rounded-full border-2 border-white flex items-center justify-center",
                          type === 'review' ? "bg-blue-100" : 
                          type === 'practice' ? "bg-green-100" : 
                          type === 'lecture' ? "bg-amber-100" : 
                          "bg-purple-100"
                        )}
                      >
                        {getActivityTypeIcon(type as string)}
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-4 space-y-3">
                      {day.activities.map((activity: any, activityIndex: number) => (
                        <motion.div
                          key={`${day.date}-${activityIndex}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: activityIndex * 0.05 }}
                          className={cn(
                            "p-4 rounded-xl border shadow-sm transition-colors",
                            getActivityTypeStyle(activity.type)
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg flex-shrink-0",
                              activity.type === "review" ? "bg-blue-100" :
                              activity.type === "practice" ? "bg-green-100" :
                              activity.type === "lecture" ? "bg-amber-100" :
                              "bg-purple-100"
                            )}>
                              {getActivityTypeIcon(activity.type)}
                            </div>
                            
                            <div className="flex-grow">
                              <h5 className="font-semibold text-gray-900">{activity.topic}</h5>
                              <p className="text-gray-600 mt-1 text-sm">{activity.description}</p>
                            </div>
                            
                            <div className="flex items-center text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm mt-3 sm:mt-0">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                              {activity.duration} minutes
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      
      {/* Empty state */}
      {sortedDays.length === 0 && (
        <div className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No activities scheduled</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Your study plan doesn't have any scheduled activities yet.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 