"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { generateProfileInsights } from "@/actions/profile-management";

interface ProfileInsightsProps {
  initialInsights?: string | null;
}

function parseInsights(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function ProfileInsights({ initialInsights }: ProfileInsightsProps) {
  const [raw, setRaw] = useState<string | null>(initialInsights ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const insights = raw ? parseInsights(raw) : [];

  const handleGenerate = () => {
    setError(null);
    startTransition(async () => {
      const result = await generateProfileInsights();
      if (result.success && result.insights) {
        setRaw(result.insights);
      } else {
        setError(result.error ?? "Failed.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(244,162,97,0.12)" }}
          >
            <Lightbulb size={13} style={{ color: "#f4a261" }} />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
            Profile Insights
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all duration-200"
          style={{
            background: "rgba(244,162,97,0.10)",
            color: "#c47f30",
            border: "1px solid rgba(244,162,97,0.2)",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <RefreshCw size={11} />
          )}
          {raw ? "Refresh" : "Generate"}
        </button>
      </div>

      {/* Insights list */}
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[13px] italic" style={{ color: "#9e9890" }}
          >
            Analyzing your profile…
          </motion.p>
        ) : insights.length > 0 ? (
          <motion.ul key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-2.5"
          >
            {insights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2"
              >
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#f4a261" }}
                />
                <p className="text-[13.5px] leading-relaxed" style={{ color: "#3a3530" }}>
                  {insight}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[13.5px]" style={{ color: "#9e9890" }}
          >
            Generate AI insights to understand your profile strengths.
          </motion.p>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-[12px]" style={{ color: "#dc2626" }}>{error}</p>
      )}
    </motion.div>
  );
}
