import { createGroq } from "@ai-sdk/groq"

// Check if the API key is available
if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not defined. The Groq API will not work properly.")
}

// Create and export the Groq client
export const groqClient = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
})

