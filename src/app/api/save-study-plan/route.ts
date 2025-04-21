import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Define types for the study plan
interface StudyDay {
  date: string;
  activities: Array<{
    type: string;
    title: string;
    description?: string;
    duration?: number;
    resources?: Array<{
      title: string;
      url?: string;
    }>;
  }>;
}

interface StudyPlan {
  days: StudyDay[];
  topics?: string[];
  recommendations?: string[];
}

// Create storage for study plans
const studyPlans = [] as Array<{
  id: string;
  userId: string;
  currentScore: number;
  targetScore: number;
  testDate: string;
  plan: StudyPlan;
  createdAt: Date;
  updatedAt: Date;
}>;

export async function POST(req: NextRequest) {
  try {
    // Get user from session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to save a study plan" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { currentScore, targetScore, testDate, plan } = body;

    // Validate required fields
    if (!currentScore || !targetScore || !testDate || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Received study plan data:", { currentScore, targetScore, testDate });
    
    // Check if this user already has a plan for this date
    const existingPlanIndex = studyPlans.findIndex(
      p => p.userId === session.user?.id && p.testDate === testDate
    );
    
    let savedPlan;
    
    if (existingPlanIndex >= 0) {
      // Update existing plan
      studyPlans[existingPlanIndex] = {
        ...studyPlans[existingPlanIndex],
        currentScore,
        targetScore,
        testDate,
        plan,
        updatedAt: new Date()
      };
      savedPlan = studyPlans[existingPlanIndex];
    } else {
      // Create new plan
      const newPlan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: session.user?.id || "anonymous", // Provide a fallback ID
        currentScore,
        targetScore,
        testDate,
        plan,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      studyPlans.push(newPlan);
      savedPlan = newPlan;
    }

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true, 
      message: "Study plan saved successfully!", 
      id: savedPlan.id 
    });
    
  } catch (error) {
    console.error("Error saving study plan:", error);
    return NextResponse.json(
      { error: "Failed to save study plan" },
      { status: 500 }
    );
  }
} 