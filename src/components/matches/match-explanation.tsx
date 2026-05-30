"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MatchExplanationProps {
  reason: string;
  compact?: boolean;
}

export function MatchExplanation({ reason, compact = false }: MatchExplanationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl flex items-start gap-3 ${compact ? "p-3" : "p-4"}`}
      style={{
        background: "linear-gradient(135deg,rgba(224,122,95,0.05),rgba(244,162,97,0.03))",
        border: "1px solid rgba(224,122,95,0.15)",
      }}
    >
      <div
        className="h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(224,122,95,0.12)" }}
      >
        <Sparkles size={11} style={{ color: "#e07a5f" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold uppercase tracking-[0.1em] mb-1 ${compact ? "text-[10px]" : "text-[11px]"}`}
          style={{ color: "#e07a5f" }}
        >
          Why this match?
        </p>
        <p
          className={`leading-relaxed ${compact ? "text-[12px] line-clamp-3" : "text-[13.5px]"}`}
          style={{ color: "#3a3530" }}
        >
          {reason}
        </p>
      </div>
    </motion.div>
  );
}
