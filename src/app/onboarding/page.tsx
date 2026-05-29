import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { WelcomeBanner } from "@/components/onboarding/welcome-banner";

export const metadata: Metadata = {
  title: "Welcome to Synq — Let's get you set up",
  description:
    "Your Synq account is ready. Complete your profile so our AI can start finding the right people for you.",
};

/**
 * Onboarding entry point — shown immediately after login or registration.
 * Protected: proxy.ts redirects unauthenticated visitors to /login.
 */
export default async function OnboardingPage() {
  const user = await getServerUser();

  // Extra server-side guard (belt-and-suspenders alongside proxy.ts)
  if (!user) {
    redirect("/login");
  }

  const name: string | null =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;

  // Determine if this is a brand-new account (created within the last 5 min)
  const createdAt = user.created_at ? new Date(user.created_at) : null;
  const isNewUser = createdAt
    ? Date.now() - createdAt.getTime() < 5 * 60 * 1000
    : false;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#fdfbf7" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(224,122,95,0.5) 0%, rgba(244,162,97,0.3) 50%, transparent 100%)",
        }}
      />

      <WelcomeBanner name={name} isNewUser={isNewUser} />
    </div>
  );
}
