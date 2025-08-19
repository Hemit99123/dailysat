import { handleGetSession } from "@/lib/auth/authActions";
import { client } from "@/lib/mongo";
import { Db } from "mongodb";

export const POST = async (request: Request) => {
    const { plan } = await request.json()

    try {
        await client.connect()

        const session = await handleGetSession()
        const email = session?.user?.email
    
        if (!email) {
          return Response.json({ message: "Unauthorized" });
        }
    
        const db: Db = client.db("DailySAT")
        const usersCollection = db.collection("users")
    
        const result = await usersCollection.updateOne(
          { email },
          { $set: { plan } }
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


export const GET = async () => {
  try {
    const session = await handleGetSession();

    await client.connect();
    const db = client.db("DailySAT");
    const usersCollection = db.collection("users");

    // Find the user
    const user = await usersCollection.findOne({ email: session?.user.email });

    return Response.json({ message: "Found study plan", plan: user?.plan });
  } catch (error) {
    return Response.json({ message: "Internal Server Error", error });
  } finally {
    await client.close();
  }
};
