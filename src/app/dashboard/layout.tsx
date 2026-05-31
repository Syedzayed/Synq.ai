import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NotificationBadge } from "@/components/notifications/notification-badge";
import { getTotalUnreadMessageCount } from "@/actions/messages";
import { checkIsAdmin } from "@/actions/admin";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getUserNotifications } from "@/actions/notifications";

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

  // Parallel fetch of badge counts, admin check, and dropdown notifications
  const [pendingCount, unreadNotifCount, unreadMsgCount, isAdmin, notificationsData] = await Promise.all([
    db.connection.count({ where: { receiverId: user.id, status: "PENDING" } }),
    db.notification.count({ where: { userId: user.id, isRead: false } }),
    getTotalUnreadMessageCount(),
    checkIsAdmin(),
    getUserNotifications(5),
  ]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#fdfbf7" }}>
      <DashboardNav
        userName={displayName}
        pendingConnectionCount={pendingCount}
        unreadNotificationCount={unreadNotifCount}
        unreadMessageCount={unreadMsgCount}
        isAdmin={isAdmin}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={displayName}
          unreadNotificationCount={unreadNotifCount}
          initialNotifications={notificationsData.unread.concat(notificationsData.read).slice(0, 5)}
        />
        <main className="flex-grow overflow-y-auto bg-[#fdfbf7] pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
