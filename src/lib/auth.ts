import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, type MongoClientOptions } from "mongodb";
import { jwt } from "better-auth/plugins";

const DB_NAME = "booknook";
const uri = process.env.DB_URL;

if (!uri) {
  throw new Error("DB_URL is not set");
}

const isServerless =
  process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

const mongoOptions: MongoClientOptions = {
  appName: "booknook-nextjs",
  maxPoolSize: 10,
  // Keep a warm floor for local dev / long-running Node servers.
  // On serverless, use 1 because every instance gets its own pool.
  minPoolSize: isServerless ? 1 : 5,
  maxIdleTimeMS: 0,
  waitQueueTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  retryWrites: true,
  retryReads: true,
};

const globalForMongo = globalThis as unknown as {
  __booknookMongoClient?: MongoClient;
  __booknookMongoConnect?: Promise<MongoClient>;
};

const client =
  globalForMongo.__booknookMongoClient ??
  new MongoClient(uri, mongoOptions);

// Cache in every environment, not just development, so HMR and warm
// serverless invocations reuse the same pool.
globalForMongo.__booknookMongoClient = client;

// Start the TLS/auth handshake before the first request. Skip it during
// `next build`, where the route is only being compiled.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!isBuildPhase && !globalForMongo.__booknookMongoConnect) {
  const connection = client.connect().catch((error) => {
    // Allow a later request to retry after a transient network failure.
    globalForMongo.__booknookMongoConnect = undefined;
    console.error("[mongodb] initial connection failed:", error);
    throw error;
  });

  globalForMongo.__booknookMongoConnect = connection;
  // Avoid an unhandled rejection if the warm-up fails before a request.
  void connection.catch(() => {});
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(DB_NAME), {
    client,
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
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      // "compact" uses HMAC and does not query the database on a cache hit.
      // Do not use "jwt" here; it would hit the JWKS collection.
      strategy: "compact",
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    jwt({
      // The client fetches /token explicitly. Without this, every
      // /get-session request also signs a JWT and queries the jwks collection.
      disableSettingJwtHeader: true,
      jwt: {
        expirationTime: "15m",
      },
    }),
  ],
});
