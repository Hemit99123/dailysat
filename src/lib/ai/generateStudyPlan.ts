import { MAX_RETRIES } from "@/data/constant"
import axios from "axios"
import { StudyPlanRequest, Activity } from "@/types/ai"

export const generateStudyPlan = async (data: StudyPlanRequest) => {
  const today = new Date()
  const testDate = new Date(data.testDate)
  const daysUntilTest = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const maxDays = Math.min(daysUntilTest, 30)

  const systemPrompt = "You are an expert SAT coach and a JSON-only response generator."

  const prompt = `You are an expert SAT coach and a JSON-only response generator.

Generate a personalized, detailed SAT study plan using the following inputs:
- Current SAT score: ${data.currentScore}
- Target SAT score: ${data.targetScore}
- Days until test: ${daysUntilTest}

Requirements:
1. Create a day-by-day schedule from today until the test date (maximum 30 days).
2. For each day, include 2–3 unique study activities, each with:
   - topic (e.g., "Reading: Main Idea Questions", "Math: Quadratic Equations")
   - type (must be either "review" or "practice")
   - duration in minutes (integer)
   - description (50–100 words of specific instructions)

3. Ensure that each activity:
   - Reflects the user's personalization: ${data.personalization}
   - Includes steps that help achieve their personalization within their prep

Format:
Return ONLY a valid and complete JSON object in the EXACT structure below — nothing else.

{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "topic": "string",
          "type": "string - only one word",
          "duration": number,
          "description": "string"
        }
      ]
    }
  ]
}

Rules:
- Do NOT include any explanation or notes before or after the JSON.
- Ensure there are no trailing commas or invalid characters.
- The response should be proper JSON that can be parsed by Javascript later on
`;

  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
  let retries = 0

  while (retries <= MAX_RETRIES) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
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
      const jsonMatch = text.match(/\{[\s\S]*\}/)

      if (!jsonMatch) throw new Error("No JSON object found in the response")

      const plan = JSON.parse(jsonMatch[0])
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

      return plan
    } catch (error) {
      retries++
      if (retries > MAX_RETRIES) throw new Error("Failed to generate valid plan after backup retries. Error:" + error)
    }
  }
}
