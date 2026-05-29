import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { ProfileDetails } from "@/components/discover/profile-details";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const profile = await db.profile.findUnique({
    where: { userId },
    select: { name: true, role: true },
  });

  if (!profile) return { title: "Profile — Synq" };

  return {
    title: `${profile.name ?? "Profile"} — Synq`,
    description: `${profile.name}'s profile on Synq${profile.role ? ` — ${profile.role}` : ""}.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  const profile = await db.profile.findUnique({
    where: { userId, completedAt: { not: null } },
    select: {
      userId: true,
      name: true,
      role: true,
      organization: true,
      aiSummary: true,
      skills: true,
      interests: true,
      projects: true,
      goals: true,
      lookingFor: true,
    },
  });

  if (!profile) notFound();

  return (
    <ProfileDetails
      profile={{
        id: profile.userId,
        name: profile.name ?? "Anonymous",
        role: profile.role,
        organization: profile.organization,
        aiSummary: profile.aiSummary,
        skills: profile.skills,
        interests: profile.interests,
        projects: profile.projects,
        goals: profile.goals,
        lookingFor: profile.lookingFor,
      }}
    />
  );
}
