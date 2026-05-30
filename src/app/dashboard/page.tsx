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

  const [topMatches, pendingCount, acceptedCount, notifData] = await Promise.all([
    getRecommendations(user!.id, 3),
    db.connection.count({ where: { receiverId: user!.id, status: "PENDING" } }),
    db.connection.count({
      where: {
        OR: [{ senderId: user!.id }, { receiverId: user!.id }],
        status: "ACCEPTED",
      },
    }),
    getUserNotifications(10),
  ]);

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
    />
  );
}
