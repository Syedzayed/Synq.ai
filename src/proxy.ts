/**
 * Next.js 16 Proxy (formerly middleware.ts).
 *
 * Runs before every matched route to:
 * 1. Refresh the Supabase session cookie.
 * 2. Redirect unauthenticated users away from protected routes → /login.
 * 3. Redirect authenticated users away from auth routes → /onboarding.
 * 4. Add security headers to every response.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseProxyClient } from "@/lib/auth/supabase-proxy";
import { SECURE_HEADERS } from "@/lib/security/rate-limit";

/** Routes only accessible when NOT authenticated */
const AUTH_ROUTES = ["/login", "/register"];

/** Routes that require a valid session */
const PROTECTED_ROUTES = ["/onboarding", "/dashboard"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build a mutable response we can attach cookies + headers to
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── 1. Refresh the Supabase session ──────────────────────────────────────
  const supabase = createSupabaseProxyClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // ── 2. Route protection ───────────────────────────────────────────────────
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    // Unauthenticated → bounce to login, preserving the intended destination
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthRoute(pathname) && isAuthenticated) {
    // Already authenticated → skip login/register, go straight to onboarding
    response = NextResponse.redirect(new URL("/onboarding", request.nextUrl));
  }

  // ── 3. Security headers ───────────────────────────────────────────────────
  Object.entries(SECURE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     * - API routes (/api/*)
     * - Static assets (_next/static, _next/image)
     * - Favicon and metadata files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
