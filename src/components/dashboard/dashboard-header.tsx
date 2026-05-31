"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, Check, ArrowRight, Settings, Sparkles } from "lucide-react";
import { signOut } from "@/lib/auth/supabase";
import { markNotificationRead, markAllNotificationsRead, NotificationItem } from "@/actions/notifications";

interface DashboardHeaderProps {
  userName: string;
  unreadNotificationCount: number;
  initialNotifications: NotificationItem[];
}

export function DashboardHeader({
  userName,
  unreadNotificationCount: initialCount,
  initialNotifications,
}: DashboardHeaderProps) {
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync props to state
  useEffect(() => {
    setUnreadCount(initialCount);
    setNotifications(initialNotifications);
  }, [initialCount, initialNotifications]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const handleMarkRead = async (id: string) => {
    const res = await markNotificationRead(id);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      router.refresh();
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllNotificationsRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      router.refresh();
    }
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center justify-between px-6 bg-[#fdfbf7]/80 backdrop-blur-md"
      style={{ borderBottom: "1px solid rgba(232, 226, 216, 0.7)" }}
    >
      {/* Page Title Context or Search bar mockup */}
      <div className="flex items-center gap-4">
        <span
          className="text-[14px] font-semibold hidden sm:inline-block"
          style={{ color: "#9e9890", fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Community Network
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl transition-colors hover:bg-[rgba(224,122,95,0.08)]"
            aria-label="Toggle notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={18} style={{ color: unreadCount > 0 ? "#e07a5f" : "#6b6560" }} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
                style={{ background: "#e07a5f" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl p-2 z-50 origin-top-right"
                style={{
                  background: "#fdfbf7",
                  border: "1px solid rgba(232, 226, 216, 0.9)",
                  boxShadow: "0 10px 30px rgba(30, 26, 23, 0.08)",
                }}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#e8e2d8]/60 mb-1">
                  <span className="text-[12.5px] font-bold text-[#1e1a17]">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold transition-colors hover:opacity-80 flex items-center gap-1"
                      style={{ color: "#e07a5f" }}
                    >
                      <Check size={11} />
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <p className="text-[12.5px]" style={{ color: "#b8b2aa" }}>
                      All quiet for now.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                        className={`flex gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                          n.isRead ? "opacity-75 hover:bg-[#f5efeb]/40" : "hover:bg-[#f5efeb]/70"
                        }`}
                        style={{
                          background: n.isRead ? "transparent" : "rgba(224,122,95,0.03)",
                        }}
                      >
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: n.isRead ? "rgba(184,178,170,0.1)" : "rgba(224,122,95,0.08)",
                            color: n.isRead ? "#9e9890" : "#e07a5f",
                          }}
                        >
                          <Sparkles size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1e1a17] truncate">{n.title}</p>
                          <p className="text-[11.5px] text-[#6b6560] leading-normal line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-[#b8b2aa] mt-1">
                            {new Date(n.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="h-1.5 w-1.5 rounded-full bg-[#e07a5f] mt-2 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-[#e8e2d8]/60 mt-1 pt-1">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex h-9 items-center justify-center gap-1 text-[11.5px] font-semibold transition-colors hover:opacity-85"
                    style={{ color: "#e07a5f" }}
                  >
                    View all notifications
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar with Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full transition-colors hover:bg-[rgba(58,53,48,0.04)]"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-sm"
              style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
            >
              {initial}
            </div>
            <span
              className="text-[13px] font-semibold hidden md:inline-block max-w-[100px] truncate"
              style={{ color: "#3a3530" }}
            >
              {userName.split(" ")[0]}
            </span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl p-1.5 z-50 origin-top-right"
                style={{
                  background: "#fdfbf7",
                  border: "1px solid rgba(232, 226, 216, 0.9)",
                  boxShadow: "0 10px 30px rgba(30, 26, 23, 0.08)",
                }}
              >
                <div className="px-3 py-2 border-b border-[#e8e2d8]/60 mb-1">
                  <p className="text-[12.5px] font-bold text-[#1e1a17] truncate">{userName}</p>
                  <p className="text-[10px] text-[#9e9890] truncate">Active Session</p>
                </div>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium transition-colors hover:bg-[#f5efeb]/70"
                  style={{ color: "#6b6560" }}
                >
                  <User size={14} />
                  My Profile
                </Link>

                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium opacity-50 cursor-not-allowed"
                  style={{ color: "#6b6560" }}
                >
                  <Settings size={14} />
                  Settings
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-50/50 mt-1"
                >
                  <LogOut size={14} />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
