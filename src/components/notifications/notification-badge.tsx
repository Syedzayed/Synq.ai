"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return (
    <Link
      href="/dashboard/notifications"
      className="relative flex items-center justify-center h-8 w-8 rounded-xl transition-colors hover:bg-[rgba(224,122,95,0.08)]"
      title="Notifications"
    >
      <Bell size={16} style={{ color: "#6b6560" }} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: "#e07a5f", color: "white" }}
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
