import { inquiryType } from "@/types/contact/inquiryType"

export const handleGetContactEmailContent = (first_name: string, last_name: string, email: string, phone: string, inquiry_type: inquiryType, message: string) => { 
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #003366;">
        <h2 style="color: #003366;">New Contact Form Submission - <span style="color: #0056b3;">DailySAT</span></h2>

        <p><strong style="color: #003366;">Name:</strong> ${first_name} ${last_name}</p>
        <p><strong style="color: #003366;">Email:</strong> ${email}</p>
        <p><strong style="color: #003366;">Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong style="color: #003366;">Inquiry Type:</strong> ${inquiry_type}</p>

        <h3 style="color: #003366;">Message:</h3>
        <p style="white-space: pre-wrap; color: #003366;">${message}</p>

        <hr style="border: none; border-top: 1px solid #0056b3; margin: 20px 0;" />
        <footer style="font-size: 0.9em; color: #555;">
        This message was sent from the <strong style="color: #0056b3;">DailySAT</strong> contact form.
        </footer>
    </div>
  `.trim()
}