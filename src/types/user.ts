// User interface representing a user in the system

import { StudyPlanProps } from "@/components/features/AI/StudyPlan";
import { ActivePowerup } from "./store";

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalIncorrect: number;
  lastAnswered?: Date;
  averageScore?: number;
}

export interface User {
    // MongoDB string 
    _id? : string,
    email: string,
    name: string,
    username?: string,
    image: string,
    isReferred: boolean,
    createdAt?: Date,
  
    // Currency
    currency: number,
  
    // Questions answered
    correctAnswered: number;
    wrongAnswered: number;

    // Stats (add missing fields here)
    currentStreak?: number;
    longestStreak?: number;
    lastAnswered?: Date;
    averageScore?: number;

    // Study plan
    plan?: StudyPlanProps;

    // User's wallet address for token transactions
    phantomWallet?: string;

    // Active powerups
    activePowerups?: ActivePowerup[];
}