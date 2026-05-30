"use client";

import { motion } from "framer-motion";
import type { CompletenessResult } from "@/lib/profile/completeness";
import { CheckCircle2, Circle } from "lucide-react";

interface ProfileCompletenessProps {
  result: CompletenessResult;
}

function scoreColor(score: number) {
  if (score >= 85) return "#16a34a";
  if (score >= 60) return "#e07a5f";
  return "#d97706";
}

export function ProfileCompleteness({ result }: ProfileCompletenessProps) {
  const { score, factors } = result;
  const color = scoreColor(score);
  const incomplete = factors.filter((f) => !f.done);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          Profile Completeness
        </p>
        <span className="text-[22px] font-bold" style={{ color }}>
          {score}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(232,226,216,0.8)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>

      {/* Factor checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-1.5">
            {f.done ? (
              <CheckCircle2 size={12} style={{ color: "#16a34a", flexShrink: 0 }} />
            ) : (
              <Circle size={12} style={{ color: "#c8c2ba", flexShrink: 0 }} />
            )}
            <span
              className="text-[11.5px] truncate"
              style={{ color: f.done ? "#3a3530" : "#b8b2aa" }}
            >
              {f.label}
            </span>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {incomplete.length > 0 && score < 100 && (
        <div
          className="mt-1 rounded-xl p-3 text-[12px]"
          style={{
            background: "rgba(224,122,95,0.05)",
            border: "1px solid rgba(224,122,95,0.12)",
            color: "#6b6560",
          }}
        >
          <span style={{ color: "#e07a5f", fontWeight: 600 }}>Next: </span>
          Add {incomplete.slice(0, 2).map((f) => f.label.toLowerCase()).join(" and ")} to improve your score.
        </div>
      )}
    </motion.div>
  );
}
