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

  user: {
    modelName: "users",
    fields: {
      id: "_id",     
      name: "name",
      email: "email",
      image: "image",
    },
    additionalFields: {
      currency: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      wrongQuestions: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      correctQuestions: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      isReferred: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      correctAnswered: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      wrongAnswered: {
        type: "number",
        required: true,
        defaultValue: 0,
      }
    },
  }
});
