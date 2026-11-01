import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

// Reuse the Mongo client across hot reloads in development.
const globalForAuth = globalThis as unknown as {
  __booknookMongoClient?: MongoClient;
};

const client =
  globalForAuth.__booknookMongoClient ??
  new MongoClient(process.env.DB_URL as string);

if (process.env.NODE_ENV !== "production") {
  globalForAuth.__booknookMongoClient = client;
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db("booknook"), {
    client,
    // The Atlas cluster supports transactions, but disabling them keeps the
    // setup compatible with standalone MongoDB instances too.
    transaction: false,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
});