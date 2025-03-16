import { MongoClient, ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client: MongoClient = new MongoClient(process.env.MONGO_URL  || "0" , {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});