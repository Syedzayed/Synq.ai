import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NotificationBadge } from "@/components/notifications/notification-badge";
import { getTotalUnreadMessageCount } from "@/actions/messages";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: { completedAt: true, name: true },
  });

  if (!profile?.completedAt) redirect("/onboarding");

  const displayName =
    profile?.name ?? user.user_metadata?.full_name ?? user.email ?? "User";

  // Parallel fetch of badge counts
  const [pendingCount, unreadNotifCount, unreadMsgCount] = await Promise.all([
    db.connection.count({ where: { receiverId: user.id, status: "PENDING" } }),
    db.notification.count({ where: { userId: user.id, isRead: false } }),
    getTotalUnreadMessageCount(),
  ]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#fdfbf7" }}>
      <DashboardNav
        userName={displayName}
        pendingConnectionCount={pendingCount}
        unreadNotificationCount={unreadNotifCount}
        unreadMessageCount={unreadMsgCount}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
