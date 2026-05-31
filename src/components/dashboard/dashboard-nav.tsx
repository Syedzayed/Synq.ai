"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Compass, Sparkles,
  LogOut, Network, UserCircle, Bell, Search, ShieldAlert
} from "lucide-react";
import { signOut } from "@/lib/auth/supabase";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardNavProps {
  userName: string;
  pendingConnectionCount?: number;
  unreadNotificationCount?: number;
  unreadMessageCount?: number;
  isAdmin?: boolean;
}

export function DashboardNav({
  userName,
  pendingConnectionCount = 0,
  unreadNotificationCount = 0,
  unreadMessageCount = 0,
  isAdmin = false,
}: DashboardNavProps) {
  const pathname = usePathname();
  const initial = userName.charAt(0).toUpperCase();

  // Desktop links - detailed
  const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard",              label: "Dashboard",     icon: LayoutDashboard },
    { href: "/dashboard/discover",     label: "Discover",      icon: Compass },
    { href: "/dashboard/matches",      label: "Matches",       icon: Sparkles },
    { href: "/dashboard/search",       label: "Search",        icon: Search },
    {
      href: "/dashboard/connections",
      label: "Connections",
      icon: Network,
      badge: pendingConnectionCount > 0 ? pendingConnectionCount : undefined,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
    },
    { href: "/dashboard/chat",         label: "AI Chat",       icon: MessageSquare },
    { href: "/dashboard/profile",      label: "Profile",       icon: UserCircle },
  ];

  if (isAdmin) {
    NAV_ITEMS.push({
      href: "/admin",
      label: "Admin Panel",
      icon: ShieldAlert,
    });
  }

  // Mobile links - compact
  const MOBILE_NAV_ITEMS: NavItem[] = [
    { href: "/dashboard",              label: "Home",          icon: LayoutDashboard },
    { href: "/dashboard/discover",     label: "Discover",      icon: Compass },
    { href: "/dashboard/search",       label: "Search",        icon: Search },
    {
      href: "/dashboard/connections",
      label: "Network",
      icon: Network,
      badge: pendingConnectionCount > 0 ? pendingConnectionCount : undefined,
    },
    {
      href: "/dashboard/messages",
      label: "Chat",
      icon: MessageSquare,
      badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
    },
    { href: "/dashboard/profile",      label: "Profile",       icon: UserCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0 py-5 px-3 bg-[#FDFBF7]"
        style={{ borderRight: "1px solid rgba(232,226,216,0.9)" }}
      >
        {/* Logo + bell */}
        <div className="flex items-center justify-between px-2 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
            >
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-[15px] font-bold" style={{ color: "#1e1a17" }}>
              Synq
            </span>
          </Link>

          {/* Bell button */}
          <Link
            href="/dashboard/notifications"
            className="relative flex items-center justify-center h-7 w-7 rounded-xl transition-colors hover:bg-[rgba(224,122,95,0.08)]"
            title="Notifications"
          >
            <Bell size={15} style={{ color: unreadNotificationCount > 0 ? "#e07a5f" : "#9e9890" }} />
            {unreadNotificationCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-bold flex items-center justify-center"
                style={{ background: "#e07a5f", color: "white" }}
              >
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{ color: active ? "#e07a5f" : "#6b6560" }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(224,122,95,0.08)", border: "1px solid rgba(224,122,95,0.15)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={15} className="relative" />
                <span className="relative flex-1">{label}</span>
                {badge != null && (
                  <span
                    className="relative h-5 min-w-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "#e07a5f", color: "white" }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div
          className="mt-4 pt-4 flex items-center gap-2.5 px-2"
          style={{ borderTop: "1px solid rgba(232,226,216,0.8)" }}
        >
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
            >
              {initial}
            </div>
            <span
              className="text-[12.5px] font-medium flex-1 truncate"
              style={{ color: "#3a3530" }}
            >
              {userName.split(" ")[0]}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-1 rounded-lg transition-colors hover:bg-red-50"
          >
            <LogOut size={13} style={{ color: "#b8b2aa" }} />
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 py-1.5"
        style={{
          background: "rgba(253,251,247,0.95)",
          borderTop: "1px solid rgba(232,226,216,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {MOBILE_NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 py-1 px-2"
              style={{ color: active ? "#e07a5f" : "#9e9890" }}
            >
              <div className="relative">
                <Icon size={18} />
                {badge != null && (
                  <span
                    className="absolute -top-1 -right-1.5 h-4 min-w-4 px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: "#e07a5f", color: "white" }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
