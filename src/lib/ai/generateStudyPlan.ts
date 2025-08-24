import { MAX_RETRIES } from "@/data/constant"
import axios from "axios"
import { StudyPlanRequest, Activity } from "@/types/ai-planner/ai"

export const generateStudyPlan = async (data: StudyPlanRequest) => {
  const today = new Date()
  const testDate = new Date(data.testDate)
  const daysUntilTest = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const maxDays = Math.min(daysUntilTest, 30) // cap at 30 days

  const prompt = `
You are an expert SAT coach and JSON-only response generator.

Generate a personalized SAT study plan that **covers exactly ${maxDays} days**, starting from today (${today.toISOString().split("T")[0]}).  

Inputs:
- Current SAT score: ${data.currentScore}
- Target SAT score: ${data.targetScore}
- Days until test: ${daysUntilTest}
- Personalization: "${data.personalization}"

Requirements:
1. The plan must include **exactly ${maxDays} days** — no fewer, no more.
2. For each day, include **2–3 unique study activities** with:
   - topic (e.g., "Reading: Main Idea Questions", "Math: Quadratic Equations")
   - type ("review" or "practice")
   - duration in minutes (integer)
   - description (50–100 words, step-by-step instructions)
3. Spread activities across all SAT sections (Math, Reading, Writing) and **avoid repeating the same topic on consecutive days**.
4. Return ONLY a valid JSON object, structured exactly like this:

{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "topic": "string",
          "type": "review or practice",
          "duration": number,
          "description": "string"
        }
      ]
    }
  ]
}

Rules:
- Do NOT include any explanations, notes, or text outside the JSON.
- Ensure the JSON is properly formatted and parsable in JavaScript.
`


  let retries = 0

  while (retries <= MAX_RETRIES) {
    try {
      const response = await axios.post("/api/mistralai", { prompt })
      const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
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
      if (retries > MAX_RETRIES) throw new Error("Failed to generate valid plan after retries. Error:" + error)
    }
  }
}
