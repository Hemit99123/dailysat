import Groq from "groq-sdk";

interface GrokResponse {
  subject: string;
  html: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
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
  "html": "<!DOCTYPE html><html lang='en'><body style='margin:0; padding:0; background-color:#f9f9f9; font-family:Arial, Helvetica, sans-serif; color:#333;'><table width='100%' cellpadding='0' cellspacing='0' border='0' bgcolor='#f9f9f9'><tr><td align='center'><table width='600' cellpadding='0' cellspacing='0' border='0' bgcolor='#ffffff' style='border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.05);'><tr><td align='center' style='padding:20px;'><img src='https://i.postimg.cc/tT0jW79H/DailySAT.png' alt='DailySAT Logo' style='width:40%; display:block; margin-bottom:10px;'><img src='https://i.postimg.cc/zG63BnPz/Untitled-design.png' alt='Study Reminder' style='width:60%; border-radius:12px 12px 0 0; display:block;'></td></tr><tr><td align='center' style='padding:20px; text-align:center;'><h1 style='font-size:24px; color:#2d3748; margin:0 0 10px;'>{Catchy header. include one emoji at the end.}</h1><p style='font-size:16px; color:#4a5568; line-height:1.6; margin:0 0 20px;'>{Body Content of reminder}</p><a href='https://dailysat.org' style='display:inline-block; padding:12px 24px; background-color:#3182ce; color:#ffffff; text-decoration:none; border-radius:6px; font-size:16px;'>Start Practicing</a></td></tr><tr><td align='center' style='padding:20px; text-align:center; font-size:12px; color:#a0aec0;'>© 2025 DailySAT. All rights reserved.</td></tr></table></td></tr></table></body></html>"
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
