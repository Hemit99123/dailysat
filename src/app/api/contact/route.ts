import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  inquiry_type: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, inquiry_type, message }: ContactFormData = body;

    // Server-side validation
    if (!first_name || !last_name || !email || !inquiry_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
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

    // Send email using a service like Resend, SendGrid, or NodeMailer
    // For now, we'll simulate sending the email
    // In production, you would integrate with an email service
    
    // Example with Resend (you would need to install @resend/react and set up RESEND_API_KEY)
    // const { Resend } = require('@resend/react');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@dailysat.com',
    //   to: 'dailysatstaff@gmail.com',
    //   subject: 'New Contact Form Submission - DailySAT',
    //   text: emailContent,
    // });

    // For now, we'll just log the email content (replace with actual email sending)
    console.log('Contact form submission:', {
      to: 'dailysatstaff@gmail.com',
      subject: 'New Contact Form Submission - DailySAT',
      content: emailContent
    });

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