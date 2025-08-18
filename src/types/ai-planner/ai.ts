export interface Activity {
    topic: string;
    description: string;
    duration: number;
    type: "review" | "practice" | "lecture" | string;
}

export interface StudyDay {
    date?: string;
    activities: Activity[];
}

export interface ValidPlan {
    isDebug?: false;
    isError?: false;
    days: StudyDay[];
}

export interface DebugPlan {
    isDebug: true;
    rawResponse: string;
}

export interface ErrorPlan {
    isError: true;
    error: string;
    rawResponse?: string;
}

export type StudyPlanData = ValidPlan | DebugPlan | ErrorPlan;

export interface StudyPlanRequest {
    currentScore: number;
    targetScore: number;
    testDate: string;
    debug?: boolean;
    personalization: string;
}
