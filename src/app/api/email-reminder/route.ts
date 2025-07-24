import { NextResponse } from 'next/server';
import { getWeeklyReminderFromGrok } from '@/lib/email/grok';
import dbConnect from '@/lib/email/dbConnect';
import User from '@/models/User';
import { divideIntoGroups } from '@/lib/email/groupUsers';
import { sendToGroup } from '@/lib/email/sendToGroup';

function getDaysSinceStartDate(startDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime(); // difference in milliseconds
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // convert to days
}


function getTodayGroupNumber(startDate: Date, numGroups: number): number {
  const daysSinceStart = getDaysSinceStartDate(startDate);
  return (daysSinceStart % numGroups) + 1; // +1 because groups are 1-based
}



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
    console.log('Grok generated html:', html);
    //GROUP SENDING
     const numGroups = 14;
      const groups = divideIntoGroups(emails, numGroups);
        
      // Start Date: July 24, 2025
      const startDate = new Date('2025-07-24'); 
        
      // Pick today’s group
      const todayGroupNum = getTodayGroupNumber(startDate, numGroups);
      const todayGroupName = `Group${todayGroupNum}`;
      const todayGroupEmails = groups[todayGroupName];
        
      console.log(`📧 Sending to ${todayGroupName} (${todayGroupEmails.length} users)`);
        
      await sendToGroup(todayGroupEmails, subject, html);
        
      return NextResponse.json({
        success: true,
        total: emails.length,
        sentGroup: todayGroupName,
        sentCount: todayGroupEmails.length,
      });


  } catch (err) {
    console.error('Error sending reminders:', err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
