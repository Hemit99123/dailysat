import { Session } from "next-auth";
import { client } from "../mongo"; // Assuming mongo client setup exists
import { ObjectId } from "mongodb";
import { User } from "@/types/user";

// Reverted function to fetch/create user from MongoDB
export const handleGetUser = async (session: Session | null): Promise<User | null> => {
    if (!session || !session.user?.email) {
        console.error("Session is invalid or user email is missing.");
        return null; // Return null or throw error as appropriate
    }

    try {
        await client.connect();
        const db = client.db("DailySAT"); // Use your actual DB name
        // Type less strictly initially to handle _id type variance
        const usersCollection = db.collection("users"); 

        // Find the user by email
        let existingUserDoc = await usersCollection.findOne({ email: session.user.email });

        // If user doesn't exist, create a new one
        if (!existingUserDoc) {
            console.log(`User ${session.user.email} not found, creating new user.`);
            // Define the structure for the new user, matching User type minus _id
            const newUser: Omit<User, '_id'> & { createdAt: Date } = { 
                email: session.user.email,
                name: session.user.name || "Unnamed User",
                username: session.user.name?.split(' ')[0].toLowerCase() || `user${Date.now()}`,
                image: session.user.image || "",
                isReferred: false,
                createdAt: new Date(), // Use Date object here
                currency: 500,
                correctAnswered: 0,
                wrongAnswered: 0,
                activePowerups: []
            };
            
            const result = await usersCollection.insertOne(newUser);
            
            // Fetch the newly created user
            existingUserDoc = await usersCollection.findOne({ _id: result.insertedId });
            if (!existingUserDoc) {
                 throw new Error("Failed to fetch newly created user.");
            }
        } else {
             console.log(`User ${existingUserDoc.email} found in DB.`);
        }
        
        // Convert to the final User type, ensuring _id is a string
        const finalUser: User = {
            _id: existingUserDoc._id?.toHexString(), // Convert ObjectId to string
            email: existingUserDoc.email,
            name: existingUserDoc.name,
            username: existingUserDoc.username,
            image: existingUserDoc.image,
            isReferred: existingUserDoc.isReferred,
            createdAt: existingUserDoc.createdAt, // Keep as Date object if needed
            currency: existingUserDoc.currency,
            correctAnswered: existingUserDoc.correctAnswered,
            wrongAnswered: existingUserDoc.wrongAnswered,
            plan: existingUserDoc.plan, // Include optional fields
            phantomWallet: existingUserDoc.phantomWallet,
            activePowerups: existingUserDoc.activePowerups
        };

        // Add default values if missing from DB record (optional, depends on schema strictness)
        finalUser.currency = finalUser.currency ?? 500;
        finalUser.correctAnswered = finalUser.correctAnswered ?? 0;
        finalUser.wrongAnswered = finalUser.wrongAnswered ?? 0;
        finalUser.isReferred = finalUser.isReferred ?? false;
        finalUser.activePowerups = finalUser.activePowerups ?? [];


        return finalUser;

    } catch (error) {
        console.error("Error in handleGetUser connecting to DB:", error);
        return null; 
    } finally {
        // Ensure the client connection is closed
        // Consider connection pooling for better performance in real apps
        // await client.close(); 
    }
};
