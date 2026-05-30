"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  UserPlus, CheckCircle2, Sparkles, Bell, Brain, Eye, ArrowRight, Activity
} from "lucide-react";
import type { NotificationItem, NotificationType } from "@/actions/notifications";

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  CONNECTION_REQUEST: UserPlus,
  CONNECTION_ACCEPTED: CheckCircle2,
  NEW_MATCH: Sparkles,
  PROFILE_VIEW: Eye,
  AI_RECOMMENDATION: Brain,
  SYSTEM: Bell,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  CONNECTION_REQUEST: "#e07a5f",
  CONNECTION_ACCEPTED: "#16a34a",
  NEW_MATCH: "#c47f30",
  PROFILE_VIEW: "#7c6d8a",
  AI_RECOMMENDATION: "#e07a5f",
  SYSTEM: "#6b7280",
};

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface ActivityWidgetProps {
  notifications: NotificationItem[];
}

export function ActivityWidget({ notifications }: ActivityWidgetProps) {
  const recent = notifications.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.08)" }}
          >
            <Activity size={13} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>
            Recent Activity
          </p>
        </div>
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-1 text-[11.5px] font-medium transition-colors hover:underline"
          style={{ color: "#e07a5f" }}
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Activity items */}
      {recent.length === 0 ? (
        <p className="text-[13px] text-center py-4" style={{ color: "#b8b2aa" }}>
          No recent activity yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {recent.map((n, i) => {
            const Icon = TYPE_ICON[n.type];
            const color = TYPE_COLOR[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div
                  className="h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}14` }}
                >
                  <Icon size={11} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium leading-snug truncate" style={{ color: n.isRead ? "#9e9890" : "#1e1a17" }}>
                    {n.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#b8b2aa" }}>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
