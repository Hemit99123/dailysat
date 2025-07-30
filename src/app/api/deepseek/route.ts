import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("here");
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
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("RESPONDING");
    console.log(response.data);
    const message = response.data?.choices?.[0]?.message?.content;
    return NextResponse.json(message);
  } catch (error: any) {
    console.error("Axios Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
