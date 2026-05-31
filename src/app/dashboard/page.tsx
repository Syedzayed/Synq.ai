import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { getRecommendations } from "@/lib/match/recommendation-service";
import { getUserNotifications } from "@/actions/notifications";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard — Synq",
  description: "Your Synq dashboard. View your profile and upcoming connections.",
};

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

  // Calculate profile completeness score
  let completeness = 0;
  if (profile) {
    if (profile.name?.trim()) completeness += 15;
    if (profile.role?.trim()) completeness += 15;
    if (profile.organization?.trim()) completeness += 10;
    if (profile.skills && profile.skills.length > 0) completeness += 20;
    if (profile.interests && profile.interests.length > 0) completeness += 15;
    if (profile.goals && profile.goals.length > 0) completeness += 15;
    if (profile.lookingFor && profile.lookingFor.length > 0) completeness += 10;
  }

  const [
    topMatches,
    pendingCount,
    acceptedCount,
    notifData,
    convoCount,
    recommendationsCount,
    activeUsersCount,
    allProfiles,
  ] = await Promise.all([
    getRecommendations(user!.id, 3),
    db.connection.count({ where: { receiverId: user!.id, status: "PENDING" } }),
    db.connection.count({
      where: {
        OR: [{ senderId: user!.id }, { receiverId: user!.id }],
        status: "ACCEPTED",
      },
    }),
    getUserNotifications(10),
    db.conversationParticipant.count({ where: { userId: user!.id } }),
    db.matchRecommendation.count({ where: { userId: user!.id } }),
    db.user.count(),
    db.profile.findMany({ select: { skills: true, interests: true } }),
  ]);

  // Dynamic skill/interest aggregations for platform analytics
  const skillCounts: Record<string, number> = {};
  const interestCounts: Record<string, number> = {};

  allProfiles.forEach((p) => {
    p.skills.forEach((s) => {
      const clean = s.trim();
      if (clean) skillCounts[clean] = (skillCounts[clean] || 0) + 1;
    });
    p.interests.forEach((i) => {
      const clean = i.trim();
      if (clean) interestCounts[clean] = (interestCounts[clean] || 0) + 1;
    });
  });

  const commonSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);

  const commonInterests = Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);

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
      topMatches={topMatches}
      pendingConnectionCount={pendingCount}
      acceptedConnectionCount={acceptedCount}
      recentNotifications={[...notifData.unread, ...notifData.read]}
      analytics={{
        user: {
          completeness,
          totalConnections: acceptedCount,
          pendingRequests: pendingCount,
          conversations: convoCount,
          aiMatchCount: recommendationsCount,
        },
        platform: {
          activeUsers: activeUsersCount,
          commonSkills,
          commonInterests,
        },
      }}
    />
  );
}
