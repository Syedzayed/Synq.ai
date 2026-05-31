"use server";

import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";

export interface AdminStats {
  totalUsers: number;
  completedProfiles: number;
  connectionRequests: number;
  acceptedConnections: number;
  conversations: number;
  messages: number;
  aiRecommendations: number;
}

export interface ActivityItem {
  id: string;
  type: "REGISTRATION" | "PROFILE_COMPLETE" | "CONNECTION";
  title: string;
  description: string;
  createdAt: Date;
}

export async function checkIsAdmin(): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  // Strict list of approved admin emails for demo/production security
  const ADMIN_EMAILS = [
    "syedzayedahmed2004@gmail.com",
    "admin@gmail.com",
    "admin@synq.ai"
  ];

  const userEmail = user.email?.toLowerCase();
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return true;
  }

  // Role-based auth verification fallback (from Prisma database)
  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: { role: true },
  });

  if (profile?.role?.toLowerCase().includes("admin")) {
    return true;
  }

  // Fallback: check if they are the first user for easy setup
  const firstUser = await db.user.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (firstUser?.id === user.id) {
    return true;
  }

  return false;
}

export async function getAdminDashboardData(): Promise<{
  success: boolean;
  stats?: AdminStats;
  activities?: ActivityItem[];
  error?: string;
}> {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Access Denied. Admin privileges required." };
  }

  try {
    const [
      totalUsers,
      completedProfiles,
      connectionRequests,
      acceptedConnections,
      conversations,
      messages,
      aiRecommendations,
      newUsers,
      newProfiles,
      newConns,
    ] = await Promise.all([
      db.user.count(),
      db.profile.count({ where: { completedAt: { not: null } } }),
      db.connection.count(),
      db.connection.count({ where: { status: "ACCEPTED" } }),
      db.conversation.count(),
      db.message.count(),
      db.matchRecommendation.count(),
      // Activities
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, email: true, name: true, createdAt: true },
      }),
      db.profile.findMany({
        where: { completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 5,
        select: { userId: true, name: true, role: true, completedAt: true },
      }),
      db.connection.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          sender: { select: { name: true } },
          receiver: { select: { name: true } },
        },
      }),
    ]);

    // Build unified feed
    const activities: ActivityItem[] = [];

    newUsers.forEach((u) => {
      activities.push({
        id: `user-${u.id}`,
        type: "REGISTRATION",
        title: "New User Registered",
        description: `${u.name || u.email} joined Synq`,
        createdAt: u.createdAt,
      });
    });

    newProfiles.forEach((p) => {
      activities.push({
        id: `profile-${p.userId}`,
        type: "PROFILE_COMPLETE",
        title: "Profile Completed",
        description: `${p.name || "A user"} completed onboarding as ${p.role || "Builder"}`,
        createdAt: p.completedAt || new Date(),
      });
    });

    newConns.forEach((c) => {
      activities.push({
        id: `conn-${c.id}`,
        type: "CONNECTION",
        title: c.status === "ACCEPTED" ? "Connection Accepted" : "New Connection Request",
        description: `${c.sender.name || "User"} requested to connect with ${c.receiver.name || "User"} (${c.status})`,
        createdAt: c.createdAt,
      });
    });

    // Sort all activities by createdAt descending
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      success: true,
      stats: {
        totalUsers,
        completedProfiles,
        connectionRequests,
        acceptedConnections,
        conversations,
        messages,
        aiRecommendations,
      },
      activities: activities.slice(0, 8),
    };
  } catch (err) {
    console.error("[getAdminDashboardData]", err);
    return { success: false, error: "Failed to load admin statistics." };
  }
}
