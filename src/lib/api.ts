// lib/api.ts
import { getClientToken, invalidateClientToken } from "./client-token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://booknook-s-ph.vercel.app/api";

export const TOKEN_STORAGE_KEY = "booknook_jwt_token";


export function removeAuthToken(): void {
  invalidateClientToken();

  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /**
   * Whether to attach a Better Auth JWT. Set to false for public endpoints so
   * signed-out visitors never hit the session-gated `/api/auth/token` route.
   * Defaults to true.
   */
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, auth = true, ...rest } = options;

  // ✅ Better Auth থেকে টোকেন নেওয়া হচ্ছে (only for authenticated endpoints)
  const token = auth ? await getClientToken() : null;

  const requestHeaders: Record<string, string> = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
    }
    throw new ApiError(
      (payload as { message?: string }).message ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload as T;
}