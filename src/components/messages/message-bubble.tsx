"use client";

import { motion } from "framer-motion";

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  createdAt: Date;
  isRead?: boolean;
  showTimestamp?: boolean;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MessageBubble({
  content,
  isOwn,
  createdAt,
  isRead = false,
  showTimestamp = false,
}: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"} gap-1`}
    >
      <div
        className="max-w-[72%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words"
        style={
          isOwn
            ? {
                background: "linear-gradient(135deg,#e07a5f,#d4694f)",
                color: "white",
                borderBottomRightRadius: "6px",
                boxShadow: "0 2px 8px rgba(224,122,95,0.25)",
              }
            : {
                background: "rgba(255,252,248,0.98)",
                color: "#1e1a17",
                border: "1px solid rgba(232,226,216,0.9)",
                borderBottomLeftRadius: "6px",
                boxShadow: "0 1px 4px rgba(58,53,48,0.05)",
              }
        }
      >
        {content}
      </div>

      {/* Timestamp + read receipt */}
      {showTimestamp && (
        <div className={`flex items-center gap-1.5 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span className="text-[10.5px]" style={{ color: "#c8c2ba" }}>
            {formatTime(createdAt)}
          </span>
          {isOwn && (
            <span className="text-[10px]" style={{ color: isRead ? "#16a34a" : "#c8c2ba" }}>
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Date divider ─────────────────────────────────────────────────────────────

export function DateDivider({ date }: { date: Date }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "rgba(232,226,216,0.7)" }} />
      <span className="text-[11px] font-medium px-2" style={{ color: "#c8c2ba" }}>
        {formatDate(date)}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(232,226,216,0.7)" }} />
    </div>
  );
}
