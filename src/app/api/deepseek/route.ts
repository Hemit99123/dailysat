import { NextRequest, NextResponse } from "next/server"; // Importing types from Next.js server API
import axios from "axios"; // HTTP client to make API requests

// Define the POST handler for the API route
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the incoming request
    const { prompt } = await req.json();

    // Debug log to confirm the endpoint is reached
    console.log("here");

    // Send POST request to OpenRouter's chat completions endpoint
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // Model to use for the completion
        model: "mistralai/mistral-7b-instruct",

        // Number of completions to generate (1 in this case)
        n: 1,

        // Messages array as expected by the OpenAI-compatible API
        messages: [
          {
            role: "user",
            content: prompt || "Solve 2x + 3 = 7 step by step", // Fallback default prompt
          },
        ],
      },
      {
        // Include API key and headers
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Secure API key from env vars
          "Content-Type": "application/json", // Ensure correct content type
        },
      }
    );

    // Log that we're about to respond, for debugging
    console.log("RESPONDING");

    // Log full API response for debugging
    console.log(response.data);

    // Extract the assistant's message content from the API response
    const message = response.data?.choices?.[0]?.message?.content;

    // Return the message content as JSON response to the client
    return NextResponse.json(message);
  } catch (error: any) {
    // Handle errors gracefully and log them
    console.error("Axios Error:", error?.response?.data || error.message);

    // Return a 500 Internal Server Error with error details
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
