import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/email';
import { getWeeklyReminderFromGrok } from '@/lib/email/grok';
import dbConnect from '@/lib/email/dbConnect';
import User from '@/models/User';
import { divideIntoGroups } from '@/lib/email/groupUsers';
import { sendToGroup } from '@/lib/email/sendToGroup';

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
    return NextResponse.json({success: true, message: subject})    
    //GROUP SENDING
    // const numGroups = 3;
    // const groups = divideIntoGroups(emails, numGroups);

    // for (const [groupName, groupEmails] of Object.entries(groups)) {
    //  console.log(`📧 Sending to ${groupName} (${groupEmails.length} users)`);
    //  await sendToGroup(groupEmails, subject, html);
    // }

    // return NextResponse.json({
    //  success: true,
    //  total: emails.length,
    //  groups: Object.fromEntries(
    //    Object.entries(groups).map(([name, list]) => [name, list.length])
    //  ),
    // });
  } catch (err) {
    console.error('Error sending reminders:', err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
