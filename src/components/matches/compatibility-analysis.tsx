"use client";

import { motion } from "framer-motion";
import { MatchScoreCircle } from "./match-score";
import { MatchExplanation } from "./match-explanation";
import { ProfileTags } from "@/components/discover/profile-tags";
import { Zap, Heart, Target, Users, TrendingUp } from "lucide-react";

interface CompatibilityAnalysisProps {
  score: number;
  reason: string;
  breakdown: {
    skills?: number;
    interests?: number;
    goals?: number;
    lookingFor?: number;
    embedding?: number;
  };
}

function BreakdownBar({
  label,
  icon: Icon,
  value,
  delay,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  delay: number;
}) {
  const tierColor =
    value >= 75 ? "#16a34a" : value >= 50 ? "#e07a5f" : "#9e9890";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={12} style={{ color: "#9e9890" }} />
          <span className="text-[12px] font-medium" style={{ color: "#6b6560" }}>
            {label}
          </span>
        </div>
        <span className="text-[12px] font-bold" style={{ color: tierColor }}>
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(232,226,216,0.8)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: tierColor }}
        />
      </div>
    </div>
  );
}

export function CompatibilityAnalysis({
  score,
  reason,
  breakdown,
}: CompatibilityAnalysisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Score circle card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
        style={{
          background: "rgba(255,252,248,0.98)",
          border: "1px solid rgba(232,226,216,0.9)",
          boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
        }}
      >
        <div className="flex items-center gap-2 self-start w-full">
          <div
            className="h-7 w-7 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.10)" }}
          >
            <TrendingUp size={14} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
            Overall Compatibility
          </p>
        </div>
        <MatchScoreCircle score={score} />
      </motion.div>

      {/* Breakdown bars card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{
          background: "rgba(255,252,248,0.98)",
          border: "1px solid rgba(232,226,216,0.9)",
          boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.10)" }}
          >
            <TrendingUp size={14} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
            Score Breakdown
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {breakdown.skills !== undefined && (
            <BreakdownBar label="Skills Overlap" icon={Zap} value={breakdown.skills} delay={0.1} />
          )}
          {breakdown.interests !== undefined && (
            <BreakdownBar label="Shared Interests" icon={Heart} value={breakdown.interests} delay={0.18} />
          )}
          {breakdown.goals !== undefined && (
            <BreakdownBar label="Goal Alignment" icon={Target} value={breakdown.goals} delay={0.26} />
          )}
          {breakdown.lookingFor !== undefined && (
            <BreakdownBar label="Looking For" icon={Users} value={breakdown.lookingFor} delay={0.34} />
          )}
        </div>
      </motion.div>

      {/* AI Explanation — full width */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="sm:col-span-2"
      >
        <MatchExplanation reason={reason} />
      </motion.div>
    </div>
  );
}

/** Overlap tags: items shared between two arrays */
export function OverlapTags({
  a,
  b,
  variant,
}: {
  a: string[];
  b: string[];
  variant: "skill" | "interest" | "goal" | "neutral";
}) {
  const overlap = a.filter((item) =>
    b.map((x) => x.toLowerCase()).includes(item.toLowerCase())
  );

  if (overlap.length === 0) return null;

  return <ProfileTags items={overlap} max={20} variant={variant} />;
}
