import axios from "axios"

interface StudyPlanRequest {
  currentScore: number
  targetScore: number
  testDate: string
  debug?: boolean
  personalization: string;
}

interface Activity {
  topic: string;
  type: string;
  duration: number;
  description: string;
}

export async function generateStudyPlan(data: StudyPlanRequest) {
  try {
    const today = new Date()
    const testDate = new Date(data.testDate)
    const daysUntilTest = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const maxDays = Math.min(daysUntilTest, 30)

    const systemPrompt = `You are an expert SAT tutor with years of experience helping students achieve their target scores. 
Your task is to create personalized, effective study plans that break down SAT preparation into manageable daily activities.
You must respond ONLY with valid JSON in the exact format specified.`

    const prompt = `Create a detailed, day-by-day SAT study plan to help a student improve from ${data.currentScore} to ${data.targetScore} in ${daysUntilTest} days.

IMPORTANT SPECIFICATIONS:
1. Each day should include 2-3 focused activities with:
   - A clear topic (e.g., "Math: Linear Equations", "Reading: Inference Questions")
   - Activity type (use only: "review", "practice", or "lecture")
   - Duration in minutes (realistic: 20-60 minutes per activity)
   - A concise, specific description limited to ONE paragraph (3-5 sentences max)

2. The plan should:
   - Build skills progressively from fundamentals to advanced concepts
   - Balance time between Math, Reading, and Writing sections proportionally
   - Include regular practice tests and review sessions
   - Focus on areas where the score improvement is most needed
   - Incorporate any personalization notes: ${data.personalization || "No specific notes provided"}

3. Activities should be specific and actionable, not generic advice.

4. Format your response as a valid JSON object strictly following this structure:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "topic": "specific topic name",
          "type": "activity type (review/practice/lecture)",
          "duration": number of minutes,
          "description": "One clear, specific paragraph describing the activity"
        }
      ]
    }
  ]
}

DO NOT include any text outside the JSON structure. Return ONLY the valid JSON object.`;

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("Groq API key is missing. Please check your environment variables.")
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    )

    const text = response.data?.choices?.[0]?.message?.content ?? ""
    
    // Find a JSON result
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON object found in the response")
    }

    const planText = jsonMatch[0]
    let plan
    
    try {
      plan = JSON.parse(planText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      throw new Error("Failed to parse JSON response")
    }

    if (!plan.days || !Array.isArray(plan.days)) {
      throw new Error("Invalid plan structure: 'days' array is missing")
    }

    const currentDate = new Date()
    
    plan.days = plan.days.slice(0, maxDays).map((day: { activities: Activity[] }, index: number) => {
      const date = new Date(currentDate)
      date.setDate(date.getDate() + index)

      return {
        ...day,
        date: date.toISOString().split("T")[0],
        activities: Array.isArray(day.activities) ? day.activities : []
      }
    })

    // Calculate success metrics for the plan
    const totalActivities = plan.days.reduce((count: number, day: any) => count + day.activities.length, 0)
    const totalDuration = plan.days.reduce((total: number, day: any) => {
      return total + day.activities.reduce((sum: number, activity: any) => sum + (activity.duration || 0), 0)
    }, 0)
    
    // Add plan metadata
    plan.metadata = {
      generatedAt: new Date().toISOString(),
      currentScore: data.currentScore,
      targetScore: data.targetScore,
      daysUntilTest,
      totalActivities,
      totalDuration,
      testDate: testDate.toISOString()
    }

    return plan
    
  } catch (error) {
    // Safely handle error objects to prevent circular references
    console.error("Error in generateStudyPlan:", error)
    
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      isError: true
    }
  }
}