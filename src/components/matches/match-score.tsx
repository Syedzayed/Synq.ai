"use client";

import { matchTier } from "@/lib/match/calculate-match";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const tierConfig = {
  excellent: {
    label: "Excellent",
    bg: "rgba(34,197,94,0.10)",
    color: "#16a34a",
    border: "rgba(34,197,94,0.25)",
    ring: "rgba(34,197,94,0.15)",
  },
  strong: {
    label: "Strong",
    bg: "rgba(224,122,95,0.10)",
    color: "#e07a5f",
    border: "rgba(224,122,95,0.25)",
    ring: "rgba(224,122,95,0.15)",
  },
  good: {
    label: "Good",
    bg: "rgba(244,162,97,0.10)",
    color: "#d97706",
    border: "rgba(244,162,97,0.25)",
    ring: "rgba(244,162,97,0.15)",
  },
  low: {
    label: "Low",
    bg: "rgba(156,163,175,0.10)",
    color: "#6b7280",
    border: "rgba(156,163,175,0.25)",
    ring: "rgba(156,163,175,0.15)",
  },
};

export function MatchScore({ score, size = "md" }: MatchScoreProps) {
  const tier = matchTier(score);
  const cfg = tierConfig[tier];

  const sizeClass = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-[12px]",
    lg: "px-4 py-1.5 text-[14px]",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClass}`}
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full inline-block"
        style={{ background: cfg.color }}
      />
      {score}% Match
    </span>
  );
}

/** Larger circular score badge for detail pages */
export function MatchScoreCircle({ score }: { score: number }) {
  const tier = matchTier(score);
  const cfg = tierConfig[tier];
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
          <circle
            cx="36"
            cy="36"
            r="28"
            fill="none"
            stroke="rgba(232,226,216,0.8)"
            strokeWidth="6"
          />
          <circle
            cx="36"
            cy="36"
            r="28"
            fill="none"
            stroke={cfg.color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] font-bold" style={{ color: cfg.color }}>
            {score}%
          </span>
        </div>
      </div>
      <span
        className="text-[11px] font-bold uppercase tracking-[0.1em]"
        style={{ color: cfg.color }}
      >
        {cfg.label} Match
      </span>
    </div>
  );
}
