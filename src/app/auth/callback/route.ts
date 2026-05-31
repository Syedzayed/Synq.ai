import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const supabase = await createSupabaseServerClient();

  // 1. Handle standard PKCE Code Exchange (e.g. OAuth or PKCE OTP redirects)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If verifying for recovery/password reset, forward to reset-password page
      if (type === "recovery") {
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // 2. Handle direct Token Hash OTP Verification (e.g. email verification and password recovery links)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }
      if (type === "signup" || type === "invite") {
        return NextResponse.redirect(new URL("/auth/verified", request.url));
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Fallback to login with error details if anything fails
  return NextResponse.redirect(
    new URL("/login?error=Invalid or expired confirmation link.", request.url)
  );
}
