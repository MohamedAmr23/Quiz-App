import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public routes and Next.js internals
  if (
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Read token from cookie (set at login)
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};