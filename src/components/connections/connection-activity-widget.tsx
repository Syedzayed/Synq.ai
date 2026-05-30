"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Network, Mail, ArrowRight } from "lucide-react";

interface ConnectionActivityWidgetProps {
  pendingCount: number;
  acceptedCount: number;
}

export function ConnectionActivityWidget({
  pendingCount,
  acceptedCount,
}: ConnectionActivityWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
            style={{ background: "rgba(34,197,94,0.10)" }}
          >
            <Network size={13} style={{ color: "#16a34a" }} />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>
            Connection Activity
          </p>
        </div>
        <Link
          href="/dashboard/connections"
          className="flex items-center gap-1 text-[11.5px] font-medium transition-colors hover:underline"
          style={{ color: "#e07a5f" }}
        >
          Manage
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pending */}
        <Link
          href="/dashboard/connections"
          className="flex flex-col gap-1 p-3 rounded-xl transition-colors hover:bg-[rgba(232,226,216,0.3)]"
          style={{ border: "1px solid rgba(232,226,216,0.7)" }}
        >
          <div className="flex items-center gap-1.5">
            <Mail size={12} style={{ color: "#e07a5f" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9e9890" }}>
              Pending
            </p>
          </div>
          <p className="text-[22px] font-bold" style={{ color: pendingCount > 0 ? "#e07a5f" : "#1e1a17" }}>
            {pendingCount}
          </p>
          <p className="text-[11px]" style={{ color: "#b8b2aa" }}>
            {pendingCount === 1 ? "request" : "requests"}
          </p>
        </Link>

        {/* Active */}
        <div
          className="flex flex-col gap-1 p-3 rounded-xl"
          style={{ border: "1px solid rgba(232,226,216,0.7)" }}
        >
          <div className="flex items-center gap-1.5">
            <Network size={12} style={{ color: "#16a34a" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9e9890" }}>
              Active
            </p>
          </div>
          <p className="text-[22px] font-bold" style={{ color: "#1e1a17" }}>
            {acceptedCount}
          </p>
          <p className="text-[11px]" style={{ color: "#b8b2aa" }}>
            {acceptedCount === 1 ? "connection" : "connections"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
