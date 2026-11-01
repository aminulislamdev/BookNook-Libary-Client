import { authClient } from "./auth-client";

export async function getClientToken(): Promise<string | null> {
  try {
    const { data } = await authClient.token();
    return data?.token ?? null;
  } catch (error) {
    console.error("Failed to get client token:", error);
    return null;
  }
}