import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dailysat.reminders@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: '"Daily SAT Reminders" <dailysat.reminders@gmail.com>',
    to,
    subject,
    html,
  });
}
