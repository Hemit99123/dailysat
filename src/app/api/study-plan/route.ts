import { auth } from "@/lib/auth";
import { client } from "@/lib/mongo";
import { Db } from "mongodb";

export const POST = async (request: Request) => {

    const { studyPlan } = await request.json()

    try {
        const session = await auth()
        const email = session?.user?.email
    
        if (!email) {
          return Response.json({ message: "Unauthorized" });
        }
    
        await client.connect()
        const db: Db = client.db("DailySAT")
        const usersCollection = db.collection("users")
    
        const result = await usersCollection.updateOne(
          { email },
          { $set: { studyPlan } }
        )
    
        if (result.modifiedCount === 0) {
          return Response.json({ message: "User not found or no changes made" });
        }
    
        return Response.json({ message: "Study plan updated successfully" })
      } catch (error) {
        console.error(error)
        return Response.json({ message: "Internal Server Error" })
      } finally {
        await client.close()
      }
}
