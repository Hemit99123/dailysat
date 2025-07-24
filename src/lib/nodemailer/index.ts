import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dailysatorg@gmail.com",
        pass: process.env.AUTH_GOOGLE_APP_PASSWORD
    }
})
