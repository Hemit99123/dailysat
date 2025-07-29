import nodemailer from 'nodemailer';
import dbConnect from "./dbConnect";
import  User from "@/models/User";

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
  } catch (err) {
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
        groups[`Group${groupIndex + 1}`].push(email);
    });

    return groups;
}

export async function sendToGroup(emails: string[], subject: string, html: string) {
  await Promise.all(
    emails.map(async (email) => {
      try {
        await sendEmail(email, subject, html);
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
      }
    })
  );
}

export async function getAllUserEmails(): Promise<string[]> {
    await dbConnect();
    const users = await User.find({}, 'email').lean();
    return users.map((user) => user.email as string);
}