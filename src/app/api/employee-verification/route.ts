import client from "@/lib/mongo";
import { Db, Document } from "mongodb";
import { redisSession as redis } from "@/lib/redis";
import { transporter } from "@/lib/nodemailer";
import otpGenerate from "@/lib/otpGenerate";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;

  if (!email) {
    return Response.json({
      code: 400,
      error: "No email paramater"
    })
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db: Db = client.db("DailySAT");

    // Check if the email exists in the database
    const docCursor = db
      .collection("employees")
      .aggregate([{ $match: { email } }, { $sample: { size: 1 } }]);
    const docArray: Document[] = await docCursor.toArray();
    const emailExists = docArray.length > 0;

    // returning (exiting) out of the function if the email is not part of the white-list of employees within the db

    if (!emailExists) {
      return Response.json({
        code: 403,
        error: "Email not authorized"
      })
    }

    // Generate OTP
    const otp = otpGenerate() 

    // Store OTP in Redis
    await redis.set(email, otp);
    await redis.expire(email, 300); // Expire in 5 minutes

    // Send OTP email
    const mailOptions = {
      from: "hemitvpatel@gmail.com",
      to: email,
      subject: "Your OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #2c7dfa;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              font-size: 14px;
              color: #666;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>DailySAT Employment System</h1>
            </div>
            <p>Hello,</p>
            <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
            <div class="otp">${otp}</div>
            <p>Please note that this OTP is valid for only 5 minutes. Do not share this code with anyone.</p>
            <p>Thank you,<br>The Team</p>
            <div class="footer">
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email through nodemailer
    await transporter.sendMail(mailOptions);

    return Response.json({
      code: 200,
      message: "OTP sent successfully",
      result: true
    })
  } catch (error) {
    return Response.json({
      code: 500,
      error
    })
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
