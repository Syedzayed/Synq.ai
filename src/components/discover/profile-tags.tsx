"use client";

import { motion } from "framer-motion";

interface ProfileTagsProps {
  items: string[];
  max?: number;
  variant?: "skill" | "interest" | "goal" | "neutral";
}

const VARIANT_STYLES = {
  skill: {
    background: "rgba(224,122,95,0.08)",
    color: "#c9604a",
    border: "1px solid rgba(224,122,95,0.2)",
  },
  interest: {
    background: "rgba(244,162,97,0.08)",
    color: "#c47f30",
    border: "1px solid rgba(244,162,97,0.25)",
  },
  goal: {
    background: "rgba(58,53,48,0.06)",
    color: "#3a3530",
    border: "1px solid rgba(58,53,48,0.12)",
  },
  neutral: {
    background: "#f8f4ef",
    color: "#3a3530",
    border: "1px solid rgba(232,226,216,0.9)",
  },
};

export function ProfileTags({ items, max = 5, variant = "neutral" }: ProfileTagsProps) {
  if (!items?.length) return null;
  const visible = items.slice(0, max);
  const overflow = items.length - max;
  const style = VARIANT_STYLES[variant];

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 rounded-full text-[11.5px] font-medium"
          style={style}
        >
          {tag}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="px-2.5 py-1 rounded-full text-[11.5px] font-medium"
          style={{ background: "#f8f4ef", color: "#b8b2aa", border: "1px solid rgba(232,226,216,0.9)" }}
        >
          +{overflow} more
        </span>
      )}
    </div>
  );
}
