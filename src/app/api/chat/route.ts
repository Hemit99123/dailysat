import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

// Allow streaming responses for up to 30 seconds
export const maxDuration = 30

// System prompt for the SAT tutor
const SYSTEM_PROMPT = `You are an SAT tutor designed to help students understand the SAT format, question types, and topics while providing strategies to improve their skills.

IMPORTANT: Your responses must ALWAYS be in the following JSON format:

{
  "basicAnswer": "Your detailed explanation addressing the user's question. Be thorough and educational.",
  "followUpQuestion": "A follow-up practice question related to the topic",
  "options": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "explanation": "Detailed explanation of why the correct answer is correct",
  "correctAnswer": "A",
  "hints": {
    "hint1": "First hint for the student if they get stuck",
    "hint2": "Second hint that provides more guidance",
    "hint3": "Third hint that almost gives away the answer"
  }
}

CRITICAL RULES:
1. ALWAYS respond with COMPLETE, valid JSON as shown above.
2. The JSON must include ALL opening and closing braces, quotes, and commas.
3. The correctAnswer must be one of: "A", "B", "C", or "D".
4. Make sure the follow-up question is directly related to your explanation.
5. Do NOT add any text outside the JSON structure.
6. Do NOT split your response - it must be a single, complete JSON object.
7. Keep your explanation concise enough to fit within the token limit.
8. NEVER include line breaks or special characters within JSON string values.
9. NEVER use escaped quotes within JSON string values.
10. ALWAYS use simple text in your responses - no markdown, no formatting.
11. DO NOT include any preamble or explanation before the JSON.
12. DO NOT include any text after the JSON.
13. Your ENTIRE response must be ONLY the JSON object.`

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Parse request body
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Use the AI SDK to stream text
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.3, // Lower temperature for more consistent outputs
      maxTokens: 2000, // Ensure we have enough tokens for complete responses
    })

    // Return the response as a stream
    return result.toDataStreamResponse({
      // Add error handling for the stream
      getErrorMessage: (error) => {
        console.error("Streaming error:", error)
        return error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred"
      },
    })
  } catch (error) {
    console.error("API route error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

