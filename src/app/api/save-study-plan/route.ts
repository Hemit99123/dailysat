import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { client } from "@/lib/mongo";

// Define types for the study plan
interface Activity {
  topic: string;
  type: string;
  duration: number;
  description: string;
}

interface StudyDay {
  date: string;
  activities: Activity[];
}

interface StudyPlan {
  days: StudyDay[];
  metadata?: {
    generatedAt: string;
    currentScore: number;
    targetScore: number;
    daysUntilTest: number;
    totalActivities: number;
    totalDuration: number;
    testDate: string;
  };
}

interface SaveStudyPlanRequest {
  currentScore: number;
  targetScore: number;
  testDate: string;
  plan: StudyPlan;
}

export async function POST(req: NextRequest) {
  let dbClient;
  
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
    const body: SaveStudyPlanRequest = await req.json();
    const { currentScore, targetScore, testDate, plan } = body;

    // Validate required fields
    if (!currentScore || !targetScore || !testDate || !plan || !plan.days) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    dbClient = await client.connect();
    const db = dbClient.db("DailySAT");
    const usersCollection = db.collection("users");
    
    // Update user document with the study plan
    const result = await usersCollection.updateOne(
      { email: userEmail },
      { 
        $set: { 
          plan,
          planMetadata: {
            currentScore,
            targetScore,
            testDate,
            updatedAt: new Date().toISOString()
          }
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Study plan saved successfully to your account!"
    });
    
  } catch (error) {
    console.error("Error saving study plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (dbClient) {
      await dbClient.close();
    }
  }
} 