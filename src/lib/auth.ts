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

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "https://booknook-c-ph.vercel.app"],

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

  
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
});