import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { ProfilePageClient } from "@/components/profile/profile-page-client";

export const metadata: Metadata = {
  title: "My Profile — Synq",
  description: "View and manage your Synq profile, skills, goals, and AI summary.",
};

export default async function ProfilePage() {
  const user = await getServerUser();

  const profile = await db.profile.findUnique({
    where: { userId: user!.id },
    select: {
      name: true,
      role: true,
      organization: true,
      skills: true,
      interests: true,
      projects: true,
      goals: true,
      lookingFor: true,
      aiSummary: true,
    },
  });

  if (!profile) notFound();

  return (
    <ProfilePageClient
      profile={{
        name: profile.name ?? user?.user_metadata?.full_name ?? "User",
        role: profile.role,
        organization: profile.organization,
        skills: profile.skills,
        interests: profile.interests,
        projects: profile.projects,
        goals: profile.goals,
        lookingFor: profile.lookingFor,
        aiSummary: profile.aiSummary,
      }}
    />
  );
}
