// User interface representing a user in the system

import { StudyPlanProps } from "@/components/features/AI/StudyPlan";

export interface User {
    // MongoDB string 
    _id? : string,
    email: string,
    name: string,
    image: string,
    isReferred: boolean,
  
    // Currency
    currency: number,
  
    // Questions answered
    correctAnswered: number;
    wrongAnswered: number;

    plan?: StudyPlanProps
}