import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#fdfbf7" }}>
      <DashboardNav userName={displayName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
