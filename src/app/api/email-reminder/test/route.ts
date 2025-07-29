import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/email';

export async function GET() {
  try {
    await sendEmail(
      'nikhilodeon.channel@gmail.com',
      'Test Subject',
      '<h1>This is a test</h1><p>If you received this, your SMTP works.</p>'
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  }
}
