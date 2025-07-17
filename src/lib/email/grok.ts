import Groq from "groq-sdk";

interface GrokResponse {
  subject: string;
  html: string;
}

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
});

export async function getWeeklyReminderFromGrok(): Promise<GrokResponse> {
  const prompt = `
You are writing a weekly SAT prep reminder email. The email should be motivational, brief, and sound encouraging.

Return only valid JSON with exactly these two fields:
1. A short, catchy subject line (under 8 words).
2. A concise HTML body (2-4 sentences) encouraging the student to stay on track with SAT prep this week. It must follow the HTML template below.

The JSON format must look like this, and must not include any extra explanation:
{
  "subject": "Subject goes here",
  "html": "<div style='font-family: Arial; margin:6%; width: 88%; text-align: center;'><img src='https://i.ibb.co/JWbkRtk6/DailySAT.png'style='width: 40%;'><h1 style='font-size: 24px; color: #2d3748; margin-bottom: 20px;'>{Catchy 3-6 word header. include 1 emoji at the end}</h1><p style='font-size: 16px; color: #4a5568;'>{Body Text for the reminder}</p><br><a href='https://dailysat.org' style='text-decoration:none; padding: 12px; background-color: #3182ce; color: #fff; font-size: 16px;'>Start Practicing</a><br><br><p style='font-size: 12px; color: #a0aec0;'>© 2025 DailySAT. All rights reserved.</p></div>"
}
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const content = chatCompletion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Groq response was empty");
  }

  try {
    const parsed: GrokResponse = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Groq JSON:", content);
    throw new Error("Groq returned invalid JSON.");
  }
}
