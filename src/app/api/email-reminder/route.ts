import { NextResponse } from 'next/server';
import { getWeeklyReminderFromGrok } from '@/lib/email/groq';
import dbConnect from '@/lib/email/dbConnect';
import User from '@/models/User';
import { divideIntoGroups, sendToGroup } from '@/lib/email/index';

function getDaysSinceStartDate(startDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayGroupNumber(startDate: Date, numGroups: number): number {
  const daysSinceStart = getDaysSinceStartDate(startDate);
  return (daysSinceStart % numGroups) + 1;
}

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, 'email').lean();
    const emails: string[] = users.map((user: any) => user.email);


    if (emails.length === 0) {
      return NextResponse.json({ success: false, message: 'No emails found.' });
    }

    const { subject, html } = await getWeeklyReminderFromGrok();
     const numGroups = 14;
      const groups = divideIntoGroups(emails, numGroups);

      const startDate = new Date('2025-07-24'); 

      const todayGroupNum = getTodayGroupNumber(startDate, numGroups);
      const todayGroupName = `Group${todayGroupNum}`;
      const todayGroupEmails = groups[todayGroupName];

      await sendToGroup(todayGroupEmails, subject, html);

      return NextResponse.json({
        success: true,
        total: emails.length,
        sentGroup: todayGroupName,
        sentCount: todayGroupEmails.length,
      });


  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message });
  }
}
