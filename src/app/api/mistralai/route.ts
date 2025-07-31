import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the POST handler for the API route
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the incoming request
    const { prompt } = await req.json();
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY environment variable");
    }
    // Send POST request to OpenRouter's chat completions endpoint
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        n: 1,
        messages: [
          {
            role: "user",
            content: prompt || "Solve 2x + 3 = 7 step by step",
          },
        ],
        timeout: 10000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the assistant's message content from the API response
    const message = response.data?.choices?.[0]?.message?.content;
    if (!message)
      return NextResponse.json(
        {
          error: "Internal Server Error",
          details: "Failed to retrieve from Deepseek",
        },
        { status: 500 }
      );
    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
