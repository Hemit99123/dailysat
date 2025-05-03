import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateStudyPlan } from "@/lib/ai/generateStudyPlan";

export async function POST(req: NextRequest) {
  try {
    // Get user from session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to generate a study plan" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { currentScore, targetScore, testDate, personalization = "" } = body;

    // Validate required fields
    if (!currentScore || !targetScore || !testDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate study plan using Groq
    const plan = await generateStudyPlan({
      currentScore,
      targetScore,
      testDate,
      personalization
    });

    // If there was an error generating the plan
    if ("isError" in plan && plan.isError) {
      return NextResponse.json(
        { 
          success: false, 
          error: plan.error || "Failed to generate study plan" 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      plan
    });
    
  } catch (error) {
    console.error("Error generating study plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export const GET = async () => {
    try {
        const session = await auth()
        const email = session?.user?.email
    
        if (!email) {
          return Response.json({ message: "Unauthorized" });
        }
    
        await client.connect()
        const user = await handleGetUser(session);

        return Response.json({ message: "Found study plan", plan: user?.plan })
      } catch (error) {
        return Response.json({ message: "Internal Server Error", error })
      } finally {
        await client.close()
      }
}