"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { NotificationCard } from "./notification-card";
import { markAllNotificationsRead } from "@/actions/notifications";
import type { NotificationsData } from "@/actions/notifications";

interface NotificationListProps {
  data: NotificationsData;
}

export function NotificationList({ data: initialData }: NotificationListProps) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

  const handleMarkAll = () => {
    startTransition(async () => {
      await markAllNotificationsRead();
      setData((prev) => ({
        ...prev,
        read: [
          ...prev.unread.map((n) => ({ ...n, isRead: true })),
          ...prev.read,
        ],
        unread: [],
        unreadCount: 0,
      }));
    });
  };

  const displayed = activeTab === "unread" ? data.unread : data.read;

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar + Mark all read */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: "rgba(232,226,216,0.35)" }}
        >
          {(["unread", "read"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-1.5 rounded-xl text-[12.5px] font-semibold capitalize transition-all duration-200"
              style={{
                color: activeTab === tab ? "#1e1a17" : "#9e9890",
              }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="notif-tab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "#fdfbf7", boxShadow: "0 1px 4px rgba(58,53,48,0.08)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{tab}</span>
              {tab === "unread" && data.unreadCount > 0 && (
                <span
                  className="relative ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "#e07a5f", color: "white" }}
                >
                  {data.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {data.unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-200"
            style={{
              background: "rgba(224,122,95,0.08)",
              color: "#e07a5f",
              border: "1px solid rgba(224,122,95,0.18)",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <AnimatePresence mode="wait">
        {displayed.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(232,226,216,0.4)" }}
            >
              {activeTab === "unread" ? (
                <Bell size={22} style={{ color: "#c8c2ba" }} />
              ) : (
                <Inbox size={22} style={{ color: "#c8c2ba" }} />
              )}
            </div>
            <div className="text-center">
              <p className="text-[14.5px] font-semibold" style={{ color: "#1e1a17" }}>
                {activeTab === "unread" ? "Nothing new right now." : "No read notifications yet."}
              </p>
              <p className="text-[13px] mt-1" style={{ color: "#9e9890" }}>
                {activeTab === "unread"
                  ? "New connections, matches and activity will appear here."
                  : "Read notifications will appear here."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {displayed.map((n, i) => (
              <NotificationCard key={n.id} notification={n} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
