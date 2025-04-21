"use client"

import { useState } from "react"
// import { generateStudyPlan } from "@/lib/ai/generateStudyPlan"
import { format, parseISO, isSameDay, isToday } from "date-fns"
import { Clock, BookOpen, BarChart3, Brain, Zap, ArrowLeft, ArrowRight, CheckCircle, Calendar as CalendarIcon, List, Save, CheckSquare } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"

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

// Define available test dates
const TEST_DATES = [
  { label: "May 3, 2025", value: "2025-05-03" },
  { label: "June 7, 2025", value: "2025-06-07" }
]

const AI = () => {
  const [currentScore, setCurrentScore] = useState("")
  const [targetScore, setTargetScore] = useState("")
  const [testDate, setTestDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null)
  const [personalization, setPersonalization] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentScore || !targetScore || !testDate) return

    setIsLoading(true)

    try {
      // Call the API to generate a study plan
      const response = await axios.post("/api/study-plan", {
        currentScore: Number(currentScore),
        targetScore: Number(targetScore),
        testDate: new Date(testDate).toISOString(),
        personalization
      });

      if (response.data.success && response.data.plan) {
        setStudyPlan(response.data.plan);
        setCurrentStep(4); // Move to the viewing step after successful generation
      } else {
        setStudyPlan({ 
          error: response.data.error || "Failed to generate plan", 
          isError: true 
        });
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      setStudyPlan({ 
        error: "An unexpected error occurred. Please try again.", 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Mock function to generate a sample study plan without API call
  const generateMockStudyPlan = () => {
    const startDate = new Date(testDate)
    const days = []
    
    // Create 14 days of mock study activities
    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() - 14 + i)
      
      const activities = [
        {
          topic: i % 3 === 0 ? "Math: Quadratic Equations" : 
                 i % 3 === 1 ? "Reading: Main Idea Questions" : 
                               "Writing: Grammar Rules",
          type: i % 2 === 0 ? "review" : "practice",
          duration: 30 + (i % 3) * 15,
          description: `This session focuses on ${i % 3 === 0 ? "solving quadratic equations using different methods including factoring, completing the square, and the quadratic formula" : 
                         i % 3 === 1 ? "identifying the main idea in complex passages and answering related questions efficiently" : 
                                       "mastering grammar rules including subject-verb agreement, pronoun usage, and punctuation"}.`
        },
        {
          topic: i % 3 === 0 ? "Writing: Sentence Structure" : 
                 i % 3 === 1 ? "Math: Data Analysis" : 
                               "Reading: Inference Questions",
          type: i % 2 === 0 ? "practice" : "review",
          duration: 45 - (i % 3) * 10,
          description: `Work on ${i % 3 === 0 ? "understanding complex sentence structures and how to revise them for clarity and conciseness" : 
                         i % 3 === 1 ? "analyzing charts, graphs, and tables to answer data-based questions accurately" : 
                                       "drawing logical inferences from text using clues and context from the passage"}.`
        }
      ]
      
      // Add a third activity randomly
      if (i % 2 === 0) {
        activities.push({
          topic: "Practice Test: Timed Section",
          type: "lecture",
          duration: 60,
          description: "Complete a full-length timed section under test conditions to build stamina and time management skills. Review incorrect answers afterward."
        })
      }
      
      days.push({
        date: date.toISOString().split("T")[0],
        activities
      })
    }
    
    return {
      days
    }
  }

  const resetForm = () => {
    setCurrentScore("")
    setTargetScore("")
    setTestDate("")
    setStudyPlan(null)
    setPersonalization("")
    setCurrentStep(1)
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
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

  // Function to render wizard navigation progress
  const renderWizardProgress = () => {
  return (
      <div className="flex items-center justify-between my-6 px-4">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                currentStep === step 
                  ? "bg-blue-600 text-white" 
                  : currentStep > step 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            <div className="text-sm mt-2 text-gray-600">
              {step === 1 && "Score"}
              {step === 2 && "Target"}
              {step === 3 && "Notes"}
              {step === 4 && "Date"}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Function to render the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">What's your current SAT score?</h2>
            <p className="text-gray-600">Enter your most recent SAT score or practice test result.</p>
            
                <input
                  type="number"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(e.target.value)}
                  min={400}
                  max={1600}
                  required
              placeholder="Enter score (400-1600)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            
            <div className="flex justify-end mt-6">
              <button
                onClick={nextStep}
                disabled={!currentScore}
                className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
              </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">What's your target SAT score?</h2>
            <p className="text-gray-600">Enter the score you're aiming to achieve.</p>
            
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  min={400}
                  max={1600}
                  required
              placeholder="Enter score (400-1600)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-md transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!targetScore}
                className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
              </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Tell us about your study preferences</h2>
            <p className="text-gray-600">Share your strengths, weaknesses, and how you prefer to study.</p>
            
                <textarea
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
              placeholder="Example: I&apos;m strong in algebra but weak in geometry. I prefer studying in the morning."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] text-md"
            />
            
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-md transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
              </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">When are you taking the SAT?</h2>
            <p className="text-gray-600">Select your upcoming test date.</p>
            
            <select
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-lg"
            >
              <option value="">Select a test date</option>
              {TEST_DATES.map(date => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-md transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!testDate || isLoading}
                className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? "Creating your plan..." : "Submit"}
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  // Function to save study plan to database
  const saveStudyPlan = async () => {
    if (!studyPlan || "isError" in studyPlan || "isDebug" in studyPlan) {
      toast.error("Cannot save an invalid study plan");
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post("/api/save-study-plan", {
        currentScore: Number(currentScore),
        targetScore: Number(targetScore),
        testDate,
        plan: studyPlan
      });

      if (response.data.success) {
        setIsSaved(true);
        toast.success("Your study plan has been saved to your account!");
      } else {
        toast.error(response.data.error || "Failed to save study plan");
      }
    } catch (error) {
      console.error("Error saving study plan:", error);
      toast.error("There was a problem saving your study plan");
    } finally {
      setIsSaving(false);
    }
  }

  // Calendar view component
  const CalendarView = () => {
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today)
    
    // Get days of current month
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      const days = []
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i))
      }
      
      return days
    }
    
    // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }
    
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const blankDays = Array(firstDayOfMonth).fill(null)
    
    // Go to previous month
    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }
    
    // Go to next month
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }
    
    // Check if a day has activities
    const getActivitiesForDay = (date: Date) => {
      if (!studyPlan || !studyPlan.days) return []
      
      return studyPlan.days.filter(day => {
        if (!day.date) return false
        const dayDate = parseISO(day.date)
        return isSameDay(dayDate, date)
      }).flatMap(day => day.activities || [])
    }
    
    return (
      <div className="mt-4">
        {/* Calendar header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={nextMonth} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Day names row */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-1 font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days of previous month */}
          {blankDays.map((_, index) => (
            <div key={`blank-${index}`} className="h-20 rounded-md bg-gray-50"></div>
          ))}
          
          {/* Cells for days of current month */}
          {daysInMonth.map(day => {
            const activities = getActivitiesForDay(day)
            const isCurrentDay = isToday(day)
            const isTestDay = testDate ? isSameDay(day, parseISO(testDate)) : false
            
            return (
              <div 
                key={day.toString()} 
                className={`h-20 p-1 rounded-md text-sm border ${
                  isCurrentDay ? 'bg-blue-50 border-blue-200' : 
                  isTestDay ? 'bg-red-50 border-red-200' : 
                  'bg-white border-gray-100'
                }`}
              >
                <div className="flex justify-between">
                  <span className={`${isCurrentDay ? 'text-blue-800 font-bold' : isTestDay ? 'text-red-600 font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {activities.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                      {activities.length}
                    </span>
                  )}
                </div>
                
                {activities.length > 0 && (
                  <div className="mt-1 overflow-hidden">
                    {activities.slice(0, 2).map((activity, i) => (
                      <div key={i} className="text-xs truncate">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          activity.type === 'review' ? 'bg-blue-500' :
                          activity.type === 'practice' ? 'bg-green-500' :
                          'bg-amber-500'
                        }`}></span>
                        {activity.topic}
                      </div>
                    ))}
                    {activities.length > 2 && (
                      <div className="text-xs text-gray-500">+{activities.length - 2} more</div>
                    )}
                  </div>
                )}
            </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Function to render the study plan view
  const renderStudyPlanView = () => {
    return (
      <>
        {/* View toggle and save button */}
        <div className="flex justify-between items-center mb-5 border-b pb-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
              }`}
            >
              <List className="h-4 w-4 mr-1.5" />
              List
            </button>
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
                viewMode === 'calendar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              Calendar
            </button>
          </div>
          
          <button
            onClick={saveStudyPlan}
            disabled={isSaving || isSaved}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
              isSaved ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaved ? (
              <>
                <CheckSquare className="h-4 w-4 mr-1.5" />
                Saved to Dashboard
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                {isSaving ? 'Saving...' : 'Save to Dashboard'}
              </>
            )}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-blue-50 rounded-md p-4">
            <div className="text-sm text-gray-600 mb-1">Days</div>
            <div className="text-xl font-bold text-gray-800">{studyPlan?.days?.length || 0}</div>
          </div>
          
          <div className="bg-blue-50 rounded-md p-4">
            <div className="text-sm text-gray-600 mb-1">Activities</div>
            <div className="text-xl font-bold text-gray-800">
              {studyPlan?.days?.reduce((total, day) => total + day.activities.length, 0) || 0}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-md p-4">
            <div className="text-sm text-gray-600 mb-1">Hours</div>
            <div className="text-xl font-bold text-gray-800">
              {Math.floor(studyPlan?.days?.reduce((total, day) => 
                total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.duration, 0), 0) / 60) || 0}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-md p-4">
            <div className="text-sm text-gray-600 mb-1">Test Date</div>
            <div className="text-xl font-bold text-gray-800">
              {TEST_DATES.find(d => d.value === testDate)?.label.split(", ")[0] || "N/A"}
            </div>
          </div>
        </div>

        {/* View content based on selected mode */}
        {viewMode === 'list' ? (
          // List view
          <div className="border rounded-md divide-y">
            {studyPlan?.days?.map((day, dayIndex) => (
              <div key={dayIndex} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">
                    {day.date ? format(new Date(day.date), "EEEE, MMMM d") : `Day ${dayIndex + 1}`}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {day.activities.reduce((total, act) => total + act.duration, 0)} min
                  </div>
                </div>
                
                <div className="space-y-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div 
                      key={activityIndex} 
                      className="border rounded-md p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded bg-white">
                            {getActivityTypeIcon(activity.type)}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">{activity.topic}</h4>
                            <span className="text-xs uppercase text-gray-500">{activity.type}</span>
                          </div>
                        </div>
                        <span className="text-sm bg-white px-2 py-0.5 rounded border text-gray-600">
                          {activity.duration} min
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Calendar view
          <CalendarView />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {!studyPlan ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white px-6 py-4">
              <h1 className="text-xl font-bold">AI Study Planner</h1>
            </div>
            
            {renderWizardProgress()}
            
            <div className="px-6 pb-6">
              {renderStepContent()}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white px-6 py-4">
              <h1 className="text-xl font-bold">Your SAT Study Plan</h1>
            </div>
            
            <div className="p-6">
              {/* Display study plan information */}
              {("isError" in studyPlan && studyPlan.isError) ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                  <p className="font-medium">Error: {studyPlan.error}</p>
                  <button
                    onClick={resetForm}
                    className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition flex items-center text-sm font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Start over
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {currentScore} → {targetScore} | {TEST_DATES.find(d => d.value === testDate)?.label.split(", ")[0] || ""}
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Reset
                    </button>
                  </div>

                  {"isDebug" in studyPlan && studyPlan.isDebug ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2 text-sm">Debug Output:</h3>
                      <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-3 rounded border">{studyPlan.rawResponse}</pre>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {renderStudyPlanView()}
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default AI