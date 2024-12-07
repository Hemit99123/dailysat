import nodemailer from 'nodemailer'

// Create a transporter using Gmail's SMTP
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL, 
        pass: process.env.APP_PASSWORD,  
    },
});

