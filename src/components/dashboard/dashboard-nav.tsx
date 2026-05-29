"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, User, Sparkles, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/supabase";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
];

interface DashboardNavProps {
  userName: string;
}

export function DashboardNav({ userName }: DashboardNavProps) {
  const pathname = usePathname();
  const initial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 flex-shrink-0 py-5 px-3"
        style={{ borderRight: "1px solid rgba(232,226,216,0.9)" }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-8">
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

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors"
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
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div
          className="mt-4 pt-4 flex items-center gap-2.5 px-2"
          style={{ borderTop: "1px solid rgba(232,226,216,0.8)" }}
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-2"
        style={{
          background: "rgba(253,251,247,0.95)",
          borderTop: "1px solid rgba(232,226,216,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-1 px-4"
              style={{ color: active ? "#e07a5f" : "#9e9890" }}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
