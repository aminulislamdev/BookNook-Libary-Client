import { authClient } from "./auth-client";

const REFRESH_MARGIN_MS = 60_000;
const FALLBACK_TTL_MS = 5 * 60_000;
const STORAGE_KEY = "booknook.jwt";

type CachedToken = {
  token: string;
  /** Epoch ms after which this token must not be reused. */
  expiresAt: number;
};

let memoryCache: CachedToken | null = null;
let inFlight: Promise<string | null> | null = null;
let cacheEpoch = 0;

function decodeJwtExpiry(token: string): number | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;

    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as {
      exp?: unknown;
    };

    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isUsable(entry: CachedToken | null): entry is CachedToken {
  return entry !== null && entry.expiresAt > Date.now();
}

function readCachedToken(): CachedToken | null {
  if (isUsable(memoryCache)) return memoryCache;

  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedToken>;
    if (typeof parsed.token !== "string" || typeof parsed.expiresAt !== "number") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const entry: CachedToken = {
      token: parsed.token,
      expiresAt: parsed.expiresAt,
    };

    if (!isUsable(entry)) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    memoryCache = entry;
    return entry;
  } catch {
    return null;
  }
}

function writeCachedToken(entry: CachedToken): void {
  memoryCache = entry;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Private mode/quota errors are fine; memory cache still works.
  }
}

async function requestToken(epoch: number): Promise<string | null> {
  try {
    // `/api/auth/token` is session-gated: calling it while signed out is
    // guaranteed to return 401. Check for a session first so guests and
    // expired sessions skip the token request instead of logging an error.
    const { data: session } = await authClient.getSession();
    if (!session?.session) return null;

    const { data, error } = await authClient.token();

    if (error) {
      // A 401 here means the session ended between the two requests. That is
      // an expected sign-out, not a token failure worth logging.
      if (error.status !== 401) {
        console.error("Failed to get client token:", error);
      }
      return null;
    }

    if (!data?.token) {
      console.error("Failed to get client token: No token returned");
      return null;
    }

    const expiry = decodeJwtExpiry(data.token);
    const expiresAt = expiry
      ? expiry - REFRESH_MARGIN_MS
      : Date.now() + FALLBACK_TTL_MS;

    // A logout/401 may have happened while this request was in flight.
    if (epoch !== cacheEpoch) return null;

    if (expiresAt > Date.now()) {
      writeCachedToken({ token: data.token, expiresAt });
    }

    return data.token;
  } catch (error) {
    console.error("Failed to get client token:", error);
    return null;
  }
}

export async function getClientToken(
  options: { forceRefresh?: boolean } = {},
): Promise<string | null> {
  // This helper is browser-only. Never share a token cache between users
  // on the server.
  if (typeof window === "undefined") return null;

  // Collapse concurrent API calls into one /token request.
  if (inFlight) return inFlight;

  if (!options.forceRefresh) {
    const cached = readCachedToken();
    if (cached) return cached.token;
  }

  const epoch = cacheEpoch;

  const request = requestToken(epoch).finally(() => {
    if (epoch === cacheEpoch) {
      inFlight = null;
    }
  });

  inFlight = request;
  return request;
}

export function invalidateClientToken(): void {
  memoryCache = null;
  inFlight = null;
  cacheEpoch += 1;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
