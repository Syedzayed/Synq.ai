"use client";

import type { ConnectionStatus } from "@/actions/connections";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus | null;
  isSender?: boolean;
}

const config: Record<string, { label: string; bg: string; color: string; border: string }> = {
  PENDING_SENDER: {
    label: "Pending",
    bg: "rgba(244,162,97,0.10)",
    color: "#c47f30",
    border: "rgba(244,162,97,0.3)",
  },
  PENDING_RECEIVER: {
    label: "Respond",
    bg: "rgba(224,122,95,0.10)",
    color: "#e07a5f",
    border: "rgba(224,122,95,0.3)",
  },
  ACCEPTED: {
    label: "Connected",
    bg: "rgba(34,197,94,0.10)",
    color: "#16a34a",
    border: "rgba(34,197,94,0.3)",
  },
  REJECTED: {
    label: "Declined",
    bg: "rgba(156,163,175,0.10)",
    color: "#6b7280",
    border: "rgba(156,163,175,0.3)",
  },
  null: {
    label: "Connect",
    bg: "#f8f4ef",
    color: "#9e9890",
    border: "rgba(232,226,216,0.9)",
  },
};

export function ConnectionStatusBadge({ status, isSender = true }: ConnectionStatusBadgeProps) {
  const key =
    status === "PENDING" ? (isSender ? "PENDING_SENDER" : "PENDING_RECEIVER") : (status ?? "null");
  const cfg = config[key] ?? config["null"];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}
