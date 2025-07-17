import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/email';
import { getWeeklyReminderFromGrok } from '@/lib/email/grok';
import dbConnect from '@/lib/email/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, 'email').lean();
    const emails: string[] = users.map((user: any) => user.email);

    console.log('Emails to send reminders to:', emails);

    if (emails.length === 0) {
      return NextResponse.json({ success: false, message: 'No emails found.' });
    }

    const { subject, html } = await getWeeklyReminderFromGrok();
    console.log('Grok generated subject:', subject);
    console.log('Grok generated HTML:', html);

    await Promise.all(
      emails.map(async (email) => {
        try {
          console.log(`Sending email to: ${email}`);
          await sendEmail(email, subject, html);
        } catch (emailErr) {
          console.error(`Failed to send email to ${email}:`, emailErr);
        }
      })
    );

    return NextResponse.json({ success: true, count: emails.length, emails });
  } catch (err) {
    console.error('Error sending reminders:', err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
