import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/email';
import { getWeeklyReminderFromGrok } from '@/lib/email/grok';
import dbConnect from '@/lib/email/dbConnect';
import User from '@/models/User'; // ✅ This now works because of default export

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, 'email').lean();
    const emails: string[] = users.map((user: any) => user.email);

    if (emails.length === 0) {
      return NextResponse.json({ success: false, message: 'No emails found.' });
    }

    const { subject, html } = await getWeeklyReminderFromGrok();

    for (const email of emails) {
      try {
        await sendEmail(email, subject, html);
        await new Promise((res) => setTimeout(res, 1000)); // 1-second throttle per email
      } catch (emailErr) {
        console.error(`Failed to send email to ${email}:`, emailErr);
      }
    }

    return NextResponse.json({ success: true, count: emails.length });
  } catch (err) {
    console.error('Error sending reminders:', err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
