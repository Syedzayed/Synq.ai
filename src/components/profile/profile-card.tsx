"use client";

import { motion } from "framer-motion";

interface ProfileCardProps {
  title: string;
  icon: React.ReactNode;
  delay?: number;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export function ProfileCard({
  title,
  icon,
  delay = 0,
  children,
  empty = false,
  emptyMessage = "Not specified yet.",
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(224,122,95,0.08)" }}
        >
          {icon}
        </div>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          {title}
        </p>
      </div>

      {empty ? (
        <p className="text-[13px] italic" style={{ color: "#c8c2ba" }}>
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </motion.div>
  );
}
