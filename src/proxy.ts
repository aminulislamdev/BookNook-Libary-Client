
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

 
  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/books/:id",
    "/profile/:path*"
  ],
};