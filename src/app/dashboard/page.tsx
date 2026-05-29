import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard — Synq",
  description: "Your Synq dashboard. View your profile and upcoming connections.",
};

// Auth + completion guards are handled by the layout — page just fetches data.
export default async function DashboardPage() {
  const user = await getServerUser();

  const profile = await db.profile.findUnique({
    where: { userId: user!.id },
    select: {
      name: true, role: true, organization: true,
      skills: true, interests: true, goals: true,
      lookingFor: true, aiSummary: true,
    },
  });

  return (
    <DashboardClient
      profile={{
        name: profile?.name ?? user?.user_metadata?.full_name ?? "there",
        role: profile?.role ?? "",
        organization: profile?.organization ?? null,
        skills: profile?.skills ?? [],
        interests: profile?.interests ?? [],
        goals: profile?.goals ?? [],
        lookingFor: profile?.lookingFor ?? [],
        aiSummary: profile?.aiSummary ?? null,
      }}
    />
  );
}
