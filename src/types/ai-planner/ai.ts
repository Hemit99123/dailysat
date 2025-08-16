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

export type StudyPlanData = ValidPlan | DebugPlan | ErrorPlan

export interface StudyPlanRequest {
  currentScore: number
  targetScore: number
  testDate: string
  debug?: boolean
  personalization: string;
}

export interface Activity {
  topic: string;
  type: string;
  duration: number;
  description: string;
}
