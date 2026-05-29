import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export const metadata: Metadata = {
  title: "Set Up Your Profile — Synq",
  description:
    "Complete your Synq profile in minutes. Our AI will build your semantic fingerprint for intelligent networking.",
};

/**
 * Onboarding page — entry point after auth.
 *
 * Server component: checks auth + profile completion before rendering.
 * - No session → /login
 * - Already completed → /dashboard
 * - Incomplete → render OnboardingShell (full multi-step flow)
 */
export default async function OnboardingPage() {
  const user = await getServerUser();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!user) {
    redirect("/login");
  }

  // ── Completion guard ────────────────────────────────────────────────────────
  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: { completedAt: true },
  });

  if (profile?.completedAt) {
    redirect("/dashboard");
  }

  // ── Render onboarding ───────────────────────────────────────────────────────
  const name: string | null =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;

  const createdAt = user.created_at ? new Date(user.created_at) : null;
  const isNewUser = createdAt
    ? Date.now() - createdAt.getTime() < 10 * 60 * 1000
    : false;

  return (
    <OnboardingShell initialName={name} isNewUser={isNewUser} />
  );
}
