import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard — Synq",
  description:
    "Your Synq dashboard. View your profile, discover connections, and manage your network.",
};

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  // If onboarding not completed, send back
  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: {
      name: true,
      role: true,
      organization: true,
      skills: true,
      interests: true,
      goals: true,
      lookingFor: true,
      aiSummary: true,
      completedAt: true,
    },
  });

  if (!profile?.completedAt) {
    redirect("/onboarding");
  }

  return (
    <DashboardClient
      profile={{
        name: profile.name ?? user.user_metadata?.full_name ?? "there",
        role: profile.role ?? "",
        organization: profile.organization ?? null,
        skills: profile.skills,
        interests: profile.interests,
        goals: profile.goals,
        lookingFor: profile.lookingFor,
        aiSummary: profile.aiSummary ?? null,
      }}
    />
  );
}
