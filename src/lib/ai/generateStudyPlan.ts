"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface StudyPlanRequest {
  currentScore: number
  targetScore: number
  testDate: string
  debug?: boolean
}

export async function generateStudyPlan(data: StudyPlanRequest) {
  try {
    // Calculate days until test
    const today = new Date()
    const testDate = new Date(data.testDate)
    const daysUntilTest = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Generate prompt for Groq
    const prompt = `
      Create a detailed SAT study plan with the following parameters:
      - Current SAT score: ${data.currentScore}
      - Target SAT score: ${data.targetScore}
      - Days until test: ${daysUntilTest}
      
      The plan should include:
      1. A day-by-day schedule from today until the test date (maximum 30 days)
      2. For each day, include 2-3 specific activities with:
         - Topic (e.g., "Reading: Main Idea Questions", "Math: Quadratic Equations")
         - Activity type (review or practice)
         - Duration in minutes
         - Brief description of what to do
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "days": [
          {
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "topic": "string",
                "type": "review|practice",
                "duration": number,
                "description": "string"
              }
            ]
          }
        ]
      }
      
      Ensure the JSON is properly formatted with no trailing commas. Do not include any explanatory text before or after the JSON.
    `

    // Call Groq API using AI SDK
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.5,
      maxTokens: 4000,
    })

    // If debug mode is enabled, return the raw response
    if (data.debug) {
      return {
        rawResponse: text,
        isDebug: true,
      }
    }

    // Parse the response as JSON
    try {
      // Find JSON in the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error("No JSON object found in the response")
      }

      const jsonString = jsonMatch[0]

      // Attempt to parse the JSON
      const plan = JSON.parse(jsonString)

      // Validate the structure
      if (!plan.days || !Array.isArray(plan.days)) {
        throw new Error("Invalid plan structure: 'days' array is missing")
      }

      // Process dates to ensure they're in the correct format
      // Limit to maximum 30 days to avoid excessive data
      const maxDays = Math.min(daysUntilTest, 30)

      const currentDate = new Date()
      plan.days = plan.days.slice(0, maxDays).map((day: { date: string; activities: { topic: string; type: "review" | "practice"; duration: number; description: string }[] }, index: number) => {
        const dayDate = new Date(currentDate)
        dayDate.setDate(currentDate.getDate() + index)

        // Ensure activities array exists
        if (!day.activities || !Array.isArray(day.activities)) {
          day.activities = []
        }

        return {
          ...day,
          date: dayDate.toISOString().split("T")[0],
        }
      })

      return plan
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError)
      // Return both the error and the raw response for debugging
      return {
        error: parseError instanceof Error ? parseError.message : "Unknown error",
        rawResponse: text,
        isError: true,
      }
    }
  } catch (error) {
    console.error("Error generating study plan:", error)
    return {
      error: "Failed to generate study plan. Please try again.",
      isError: true,
    }
  }
}

