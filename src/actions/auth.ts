"use server";

/**
 * Server Action: runs after Supabase signUp on the client.
 * - Creates/updates the Prisma user + profile record
 * - Sends the welcome email via Resend
 * - Applies rate limiting
 */

import { ensureUserProfile } from "@/lib/auth/db-verify";
import { sendWelcomeEmail } from "@/lib/email/welcome";
import { checkRateLimit, normalizeEmail } from "@/lib/security/rate-limit";
import { headers } from "next/headers";
import { devLog, PerfTimer } from "@/lib/security/logger";

interface PostRegistrationOptions {
  supabaseId: string;
  email: string;
  name?: string | null;
}

export async function postRegistration({
  supabaseId,
  email,
  name,
}: PostRegistrationOptions): Promise<{ success: boolean; error?: string }> {
  const timer = new PerfTimer();
  // ── Rate limit by IP ────────────────────────────────────────────────────
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rl = checkRateLimit("register", ip);
  if (!rl.allowed) {
    const waitSec = Math.ceil((rl.remainingMs ?? 0) / 1000);
    return {
      success: false,
      error: `Too many registration attempts. Please wait ${waitSec}s before trying again.`,
    };
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    // ── Create Prisma user + profile ──────────────────────────────────────
    await ensureUserProfile({
      supabaseId,
      email: normalizedEmail,
      name,
    });

    // ── Send welcome email in the background (completely non-blocking!) ──
    sendWelcomeEmail({ to: normalizedEmail, name }).catch((err) => {
      console.error("[postRegistration] background welcome email failed:", err);
    });

    const elapsed = timer.stop();
    devLog("SIGNUP", "User successfully registered & database profiles self-healed.", {
      supabaseId,
      email: normalizedEmail,
      ip,
    }, elapsed);

    return { success: true };
  } catch (err) {
    console.error("[postRegistration]", err);
    return {
      success: false,
      error: "An error occurred while setting up your account.",
    };
  }
}

/** Rate-checked login helper — called from the login form. */
export async function checkLoginRateLimit(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rl = checkRateLimit("login", ip);
  if (!rl.allowed) {
    const waitSec = Math.ceil((rl.remainingMs ?? 0) / 1000);
    return {
      allowed: false,
      error: `Too many login attempts. Please wait ${waitSec}s.`,
    };
  }

  return { allowed: true };
}

/** Server-side admin role seeder - sets role to Admin and completedAt to current date. */
export async function seedAdminUserPrismaRole(supabaseUserId: string): Promise<void> {
  const { db } = await import("@/lib/db/prisma");
  await db.profile.update({
    where: { userId: supabaseUserId },
    data: {
      role: "Admin",
      completedAt: new Date(),
    },
  });
}

/** Rate-checked password reset helper — called from forgot-password form. */
export async function checkPasswordResetRateLimit(): Promise<{
  allowed: boolean;
  error?: string;
}> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rl = checkRateLimit("forgot_password", ip);
  if (!rl.allowed) {
    const waitSec = Math.ceil((rl.remainingMs ?? 0) / 1000);
    return {
      allowed: false,
      error: `Too many password reset requests. Please wait ${waitSec}s.`,
    };
  }

  return { allowed: true };
}
