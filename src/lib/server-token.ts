// lib/server-token.ts
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerToken(): Promise<string | null> {
  try {
    const reqHeaders = await headers();

  
    const { token } = await auth.api.getToken({
      headers: reqHeaders,
    });

    return token || null;
  } catch (error) {
    console.error("Failed to get server token:", error);
    return null;
  }
}