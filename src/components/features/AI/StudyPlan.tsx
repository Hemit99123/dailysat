"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/features/AI/Calendar"
import axios from "axios"
import { motion } from "framer-motion"
import { CalendarDays, List, Save, CheckCircle, Clock, BookOpen, BarChart3, Brain, Download, Award, Zap } from "lucide-react"
import { toast } from "react-toastify"

interface Activity {
  topic: string
  description: string
  duration: number
  type: "review" | "practice" | "lecture" | string
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

  if ("isDebug" in plan && plan.isDebug) {
    return (
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="border-b px-6 py-4 bg-gray-100">
          <h2 className="text-lg font-semibold">Raw Response from Groq (Debug Mode)</h2>
          <p className="text-sm text-gray-500">This is the raw response from the AI model for debugging purposes.</p>
        </div>
        <div className="p-6 max-h-[600px] overflow-auto text-xs whitespace-pre-wrap bg-gray-50">
          <pre>{plan.rawResponse}</pre>
        </div>
      </div>
    )
  }

  if ("isError" in plan && plan.isError) {
    return (
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="border-b px-6 py-4 bg-red-100">
          <h2 className="text-lg font-semibold text-red-600">Error Generating Study Plan</h2>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-300 p-4 rounded-lg text-sm text-red-700">
            <strong>Error:</strong> {plan.error}
          </div>
          {plan.rawResponse && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Raw Response (for debugging):</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[400px] border text-xs whitespace-pre-wrap">
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
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="border-b px-6 py-4 bg-gray-100">
          <h2 className="text-lg font-semibold">No Study Plan Available</h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg text-sm text-yellow-800">
            <strong>No Data:</strong> No study plan data is available. Please try again.
          </div>
        </div>
      </div>
    )
  }

  const handleSavePlan = async () => {
    try {
    await axios.post("/api/study-plan", {
      plan
    })
      setSavedPlan(true)
      toast.success("Study plan saved successfully!")
    } catch (error) {
      toast.error("Failed to save study plan. Please try again.")
      console.error("Failed to save plan:", error)
    }
  }

  // Calculate total study time
  const totalStudyTime = plan.days.reduce((total, day) => {
    return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.duration, 0)
  }, 0)
  
  // Calculate hours and minutes
  const totalHours = Math.floor(totalStudyTime / 60)
  const totalMinutes = totalStudyTime % 60
  
  // Calculate total number of activities
  const totalActivities = plan.days.reduce((total, day) => {
    return total + day.activities.length
  }, 0)

  // Calculate total days
  const totalDays = plan.days.length

  const activityTypeCount = {
    review: 0,
    practice: 0,
    lecture: 0,
    other: 0
  }

  plan.days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.type === "review") activityTypeCount.review++
      else if (activity.type === "practice") activityTypeCount.practice++
      else if (activity.type === "lecture") activityTypeCount.lecture++
      else activityTypeCount.other++
    })
  })

  const getActivityIcon = (type: string) => {
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'from-blue-500 to-blue-600'
      case 'practice':
        return 'from-green-500 to-green-600'
      case 'lecture':
        return 'from-amber-500 to-amber-600'
      default:
        return 'from-purple-500 to-purple-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl shadow-lg bg-white overflow-hidden border border-gray-100">
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <div className="w-full h-full relative">
              <Award className="absolute top-8 right-8 w-48 h-48" />
            </div>
          </div>
          
          <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Personalized Study Plan</h2>
                    <p className="text-blue-100 text-sm mt-1">Custom-built for your score goal and learning style</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-blue-200" />
                    <span className="text-xs font-medium text-blue-100">Duration</span>
                  </div>
                  <div className="text-lg font-bold text-white">{totalDays} Days</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-blue-200" />
                    <span className="text-xs font-medium text-blue-100">Activities</span>
                  </div>
                  <div className="text-lg font-bold text-white">{totalActivities} Total</div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2 text-blue-100">
                  <Brain className="h-4 w-4" />
                  <span className="text-xs font-medium">Current Score</span>
                </div>
                <div className="text-2xl font-bold text-white">{currentScore}</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2 text-blue-100">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium">Target Score</span>
                </div>
                <div className="text-2xl font-bold text-white">{targetScore}</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2 text-blue-100">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-medium">Test Date</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {testDate ? format(testDate, "MMM d, yyyy") : "N/A"}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2 text-blue-100">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Study Time</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalHours}h {totalMinutes}m</div>
              </motion.div>
          </div>
        </div>

          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-4 px-8 border-b">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView("calendar")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    view === "calendar" 
                      ? "bg-white text-blue-700 shadow-md ring-1 ring-gray-100" 
                      : "bg-white/50 text-gray-700 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" />
              Calendar View
            </button>
            <button
              onClick={() => setView("list")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    view === "list" 
                      ? "bg-white text-blue-700 shadow-md ring-1 ring-gray-100" 
                      : "bg-white/50 text-gray-700 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  <List className="h-4 w-4" />
              List View
            </button>
              </div>

            <button 
              onClick={handleSavePlan}
              disabled={isSavedPlan}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSavedPlan
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                }`}
              >
                {isSavedPlan ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Plan Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
              Save Plan
                  </>
                )}
            </button>
          </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 pt-4 border-t border-blue-100/50">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Review: {activityTypeCount.review}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Practice: {activityTypeCount.practice}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Lecture: {activityTypeCount.lecture}</span>
              </div>
              {activityTypeCount.other > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Other: {activityTypeCount.other}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
          {view === "calendar" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
              <Calendar 
                plan={plan}
                  testDate={testDate}
              />
              </motion.div>
          )}

          {view === "list" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-5">
              {plan.days.map((day, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border rounded-xl overflow-hidden shadow-sm bg-white"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-blue-600 font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-800">
                    {day.date ? format(new Date(day.date), "EEEE, MMMM d") : `Day ${index + 1}`}
                          </span>
                        </div>
                        
                        {day.activities && day.activities.length > 0 && (
                          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700">
                              {day.activities.reduce((total, act) => total + act.duration, 0)} min
                            </span>
                          </div>
                        )}
                  </div>
                      <div className="p-5">
                    {day.activities && day.activities.length > 0 ? (
                          <div className="space-y-4">
                        {day.activities.map((activity, actIndex) => (
                              <motion.div
                            key={actIndex}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + actIndex * 0.03 }}
                                className="flex gap-4 rounded-xl border shadow-sm overflow-hidden"
                              >
                                <div className={`w-2 bg-gradient-to-b ${getActivityColor(activity.type)}`}></div>
                                <div className="flex-1 p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2.5 rounded-lg ${
                                        activity.type === "review" ? "bg-blue-50" :
                                        activity.type === "practice" ? "bg-green-50" :
                                        activity.type === "lecture" ? "bg-amber-50" :
                                        "bg-purple-50"
                                      }`}>
                                        {getActivityIcon(activity.type)}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-900">{activity.topic}</div>
                                        <div className="text-xs uppercase tracking-wider font-medium mt-0.5 opacity-70 text-gray-700">
                                          {activity.type}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600 whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded-lg">
                                      <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                      {activity.duration} min
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 pt-3 border-t text-gray-700 text-sm">
                                    {activity.description}
                                  </div>
                            </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm py-3 text-center bg-gray-50 rounded-lg">No activities scheduled for this day.</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            </div>
        </div>
      </div>
    </div>
  )
}
