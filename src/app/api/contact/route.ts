import { NextRequest, NextResponse } from 'next/server';
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, inquiry_type, message } = body;

    // Server-side validation
    if (!first_name || !last_name || !email || !inquiry_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = `
        New Contact Form Submission - DailySAT

        Name: ${first_name} ${last_name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Inquiry Type: ${inquiry_type}

        Message:
        ${message}

        ---
        This message was sent from the DailySAT contact form.
    `.trim();

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        to: "dailysatstaff@gmail.com",
        subject: 'New Form Submission - DailySAT',
        text: emailContent
      })
    } catch(error) {
      throw new Error(`Failed to send email ${error}`)
    }

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
} 
