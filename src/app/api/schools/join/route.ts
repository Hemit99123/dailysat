import { auth } from "@/lib/auth";
import { client } from "@/lib/mongo";
import { Collection, Db, Document, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    const body = await request.json();
    const school = body.schoolID;

    // Check if schoolID is provided in the request
    if (!school) {
        return NextResponse.json({ success: false, message: "schoolID is required" }, { status: 400 });
    }

    // Get the authenticated user email
    const session = await auth();
    const email: string | null | undefined = session?.user?.email;

    if (!email) {
        return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    try {
        await client.connect();
        const db: Db = client.db("DailySAT");
        const userCollection: Collection<Document> = db.collection("users");
        const schoolCollection: Collection<Document> = db.collection("schools");

        // Retrieve the user document
        const userBefore = await userCollection.findOne({ email });

        if (!userBefore) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Proceed with the update if schoolID is different
        const response = await userCollection.updateOne(
            { email, enrolledSchool: { $ne: school } }, // Only update if school is different
            { $set: { enrolledSchool: school } },
        );

        if (response.modifiedCount == 1) {
            // Remove the user from the previous school's students array if they were enrolled in one
            if (userBefore.enrolledSchool) {
                await schoolCollection.updateOne(
                    { _id: new ObjectId(userBefore.enrolledSchool) },

                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    { $pull: { students: email as any } } 
                );
                
            }

            // Add the user to the new school's students array
            await schoolCollection.updateOne(
                { _id: new ObjectId(school) }, // Assuming `school` is the schoolID or _id of the school document
                {
                    $addToSet: { students: email } // Using $addToSet to avoid duplicate emails in the students array
                }
            );

            // Success response
            return NextResponse.json({ success: true, message: "School enrollment updated and student added to school" });
        } else {
            return NextResponse.json({ success: false, message: "Already enrolled in the same school" });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error });
    } finally {
        await client.close();
    }
};
