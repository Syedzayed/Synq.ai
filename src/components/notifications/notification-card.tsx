"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  UserPlus, CheckCircle2, Sparkles, Eye, Brain, Bell, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { markNotificationRead } from "@/actions/notifications";
import type { NotificationItem, NotificationType } from "@/actions/notifications";

// ─── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string; border: string; actionPath?: (n: NotificationItem) => string }
> = {
  CONNECTION_REQUEST: {
    icon: UserPlus,
    color: "#e07a5f",
    bg: "rgba(224,122,95,0.08)",
    border: "rgba(224,122,95,0.18)",
    actionPath: (n) => n.relatedUserId ? `/dashboard/discover/${n.relatedUserId}` : "/dashboard/connections",
  },
  CONNECTION_ACCEPTED: {
    icon: CheckCircle2,
    color: "#16a34a",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.18)",
    actionPath: (n) => n.relatedUserId ? `/dashboard/discover/${n.relatedUserId}` : "/dashboard/connections",
  },
  NEW_MATCH: {
    icon: Sparkles,
    color: "#c47f30",
    bg: "rgba(244,162,97,0.08)",
    border: "rgba(244,162,97,0.18)",
    actionPath: (n) => n.relatedUserId ? `/dashboard/discover/${n.relatedUserId}` : "/dashboard/discover",
  },
  PROFILE_VIEW: {
    icon: Eye,
    color: "#7c6d8a",
    bg: "rgba(124,109,138,0.08)",
    border: "rgba(124,109,138,0.18)",
    actionPath: () => "/dashboard/profile",
  },
  AI_RECOMMENDATION: {
    icon: Brain,
    color: "#e07a5f",
    bg: "rgba(224,122,95,0.08)",
    border: "rgba(224,122,95,0.18)",
    actionPath: () => "/dashboard/discover",
  },
  SYSTEM: {
    icon: Bell,
    color: "#6b7280",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.18)",
  },
};

// ─── Timestamp ────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── NotificationCard ─────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: NotificationItem;
  index?: number;
}

export function NotificationCard({ notification, index = 0 }: NotificationCardProps) {
  const [isRead, setIsRead] = useState(notification.isRead);
  const [isPending, startTransition] = useTransition();
  const cfg = TYPE_CONFIG[notification.type];
  const Icon = cfg.icon;
  const actionPath = cfg.actionPath?.(notification);

  const handleRead = () => {
    if (isRead) return;
    startTransition(async () => {
      await markNotificationRead(notification.id);
      setIsRead(true);
    });
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleRead}
      className="group flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-200 cursor-pointer"
      style={{
        background: isRead
          ? "rgba(255,252,248,0.6)"
          : "rgba(255,252,248,0.98)",
        border: isRead
          ? "1px solid rgba(232,226,216,0.6)"
          : "1px solid rgba(232,226,216,0.9)",
        boxShadow: isRead ? "none" : "0 2px 10px rgba(58,53,48,0.05)",
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {/* Icon */}
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        <Icon size={15} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[13.5px] font-semibold leading-snug"
            style={{ color: isRead ? "#6b6560" : "#1e1a17" }}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!isRead && (
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: cfg.color }}
              />
            )}
            <span className="text-[11px]" style={{ color: "#7e756c" }}>
              {timeAgo(notification.createdAt)}
            </span>
          </div>
        </div>
        <p className="text-[12.5px] mt-0.5 leading-relaxed" style={{ color: "#5a544e" }}>
          {notification.message}
        </p>
      </div>

      {/* Arrow on hover */}
      {actionPath && (
        <ArrowRight
          size={13}
          className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cfg.color }}
        />
      )}
    </motion.div>
  );

  if (actionPath) {
    return <Link href={actionPath}>{content}</Link>;
  }
  return content;
}
