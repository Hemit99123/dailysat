import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl || (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://"))) {
  throw new Error(
    "Invalid MongoDB connection string. Please set the MONGO_URL environment variable to a valid connection string starting with 'mongodb://' or 'mongodb+srv://'."
  );
}

export const client: MongoClient = new MongoClient(mongoUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db("DailySAT")