import nodemailer from 'nodemailer';
import { client } from '@/lib/mongo';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dailysat.reminders@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: '"Daily SAT Reminders" <dailysat.reminders@gmail.com>',
      to,
      subject,
      html,
    });

  } catch (err: any) {
    throw err;
  }
}

export function divideIntoGroups(emails: string[], numGroups: number): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (let i = 0; i < numGroups; i++) {
    groups[`Group${i + 1}`] = [];
  }

  emails.forEach((email, index) => {
    const groupIndex = index % numGroups;
    const groupName = `Group${groupIndex + 1}`;
    groups[groupName].push(email);
  });


  return groups;
}

export async function sendToGroup(emails: string[], subject: string, html: string) {

  await Promise.all(
    emails.map(async (email) => {
      try {
        await sendEmail(email, subject, html);
      } catch (err) {
        throw err;
      }
    })
  );
}

export async function getAllUserEmails(): Promise<string[]> {
  await client.connect();
  const db = client.db();
  const usersCollection = db.collection('users');
  const users = await usersCollection.find({}, { projection: { email: 1, _id: 0 } }).toArray();
  return users.map((user) => user.email);
}
