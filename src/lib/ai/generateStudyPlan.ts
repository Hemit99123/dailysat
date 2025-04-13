import axios from "axios"

interface StudyPlanRequest {
  currentScore: number
  targetScore: number
  testDate: string
  debug?: boolean
  personalization: string;
}

export async function generateStudyPlan(data: StudyPlanRequest) {
  try {
    const today = new Date()
    const testDate = new Date(data.testDate)
    const daysUntilTest = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const maxDays = Math.min(daysUntilTest, 30)

    const systemPrompts = "You are an expert in the SATs. You are a study planner for the SATs"

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
      3. Make the plan personal through different personalizations such as concepts the user is struggling with, preferred study techniques, etc which is specified in ${data.personalization}. Ensure to add steps the user can complete to help reach their persoanlization within the activities in the result.

      Return ONLY a valid JSON object with this EXACT structure:
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

      Within the description, please ensure to provide a very detailed (50-100 words) on actions that the user can do for the activity

      Ensure the final JSON result is properly formatted with no trailing commas. Do not include any explanatory text before or after the JSON.
    `

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompts },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`
        }
      }
    )

    const text = response.data?.choices?.[0]?.message?.content ?? ""
    
    // find a json result
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON object found in the response")
    }

    const plan = JSON.parse(jsonMatch[0])

    if (!plan.days || !Array.isArray(plan.days)) {
      throw new Error("Invalid plan structure: 'days' array is missing")
    }

    const currentDate = new Date()
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    plan.days = plan.days.slice(0, maxDays).map((day: any, index: number) => {
      const date = new Date(currentDate)
      date.setDate(date.getDate() + index)

      return {
        ...day,
        date: date.toISOString().split("T")[0],
        activities: Array.isArray(day.activities) ? day.activities : []
      }
    })

    return plan
  } catch (error) {
    return {
      error: error ?? "Unknown error",
      isError: true
    }
  }
}
