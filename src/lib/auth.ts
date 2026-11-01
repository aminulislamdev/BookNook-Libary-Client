
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.DB_URL;
if (!uri) throw new Error("DB_URL is not set");

// Reuse one client across HMR reloads and warm serverless invocations.
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
const client = (globalForMongo._mongoClient ??= new MongoClient(uri));

export const auth = betterAuth({
  database: mongodbAdapter(client.db("booknook"), { transaction: false }),
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: { enabled: true },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    jwt({
      disableSettingJwtHeader: true,
      jwt: {
        expirationTime: "15m",
      },
    }),
  ],
});
