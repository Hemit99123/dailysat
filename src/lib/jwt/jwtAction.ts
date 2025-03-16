"use server"

import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET; // Secret stored securely in environment variables

// Server Action
export const generateJWT = async (payload: object) => {
    try {
        // Authenticate the user (this assumes `auth()` returns session information)
        const session = await auth();

        if (!session || !session.user) {
            throw new Error("Unauthorized: User not authenticated");
        }

        // Stringify the payload if it's an object
        const payloadString = typeof payload === 'object' ? JSON.stringify(payload) : payload;

        // Generate a JWT with the payload
        const token = jwt.sign(
            JSON.parse(payloadString),
            JWT_SECRET || "",
            { expiresIn: "3s" } // Token expiration
        );

        // Return the JWT
        return token;
    } catch (err) {
        console.error("Error generating token:", err);
        throw new Error("Internal Server Error");
    }
}
