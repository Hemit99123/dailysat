import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "../mongo";

const db = client.db();

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET as string,
    },
  },
  database: mongodbAdapter(db),
});

