import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the API key is set
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 })
    }

    // Return a success response with a masked API key
    const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`

    return NextResponse.json({
      status: "ok",
      message: "API key is configured",
      keyPreview: maskedKey,
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json({ error: "An error occurred during the test" }, { status: 500 })
  }
}

