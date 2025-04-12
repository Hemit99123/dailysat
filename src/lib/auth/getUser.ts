import { client } from "../mongo";
import { Session } from "next-auth";

export const handleGetUser = async (session: Session | null) => {
    try {
        if (!session || !session.user?.email) {
            throw new Error("Session is invalid or user email is missing.");
        }
        await client.connect();
        const db = client.db("SATDaily");
        const usersCollection = db.collection("users");

        // Find the user
        let existingUser = await usersCollection.findOne({ email: session.user.email });

        // If user doesn't exist, create a new record
        if (!existingUser) {
            const newUser = {
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                id: session.user.id,
                currency: 0,
                wrongQuestions: 0,
                correctQuestions: 0,
                isReferred: false,
            };

            const result = await usersCollection.insertOne(newUser);

            // Retrieve the newly created user for returning
            existingUser = await usersCollection.findOne({ _id: result.insertedId });
        }

        return existingUser;
    } catch (error) {
        throw new Error(`An unexpected error occurred: ${error}`);
    }
};
