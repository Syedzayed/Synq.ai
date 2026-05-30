"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { regenerateSummary } from "@/actions/profile-management";

interface AiSummaryCardProps {
  summary: string | null;
}

export function AiSummaryCard({ summary: initialSummary }: AiSummaryCardProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = () => {
    setError(null);
    startTransition(async () => {
      const result = await regenerateSummary();
      if (result.success && result.summary) {
        setSummary(result.summary);
      } else {
        setError(result.error ?? "Failed to regenerate.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(224,122,95,0.06) 0%, rgba(244,162,97,0.03) 100%)",
        border: "1px solid rgba(224,122,95,0.2)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.12)" }}
          >
            <Brain size={13} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#e07a5f" }}>
            AI Profile Summary
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all duration-200 hover:shadow-sm"
          style={{
            background: isPending ? "rgba(224,122,95,0.1)" : "rgba(224,122,95,0.12)",
            color: "#e07a5f",
            border: "1px solid rgba(224,122,95,0.2)",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <RefreshCw size={11} />
          )}
          {isPending ? "Generating…" : "Regenerate"}
        </button>
      </div>

      {/* Summary text */}
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles size={13} style={{ color: "#e07a5f" }} />
            <span className="text-[13px] italic" style={{ color: "#9e9890" }}>
              Crafting your summary with Mistral AI…
            </span>
          </motion.div>
        ) : summary ? (
          <motion.p
            key="summary"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[14px] leading-relaxed"
            style={{ color: "#3a3530" }}
          >
            &ldquo;{summary}&rdquo;
          </motion.p>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-[13.5px]" style={{ color: "#9e9890" }}>
              No AI summary yet. Generate one to strengthen your profile.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-[12px]" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </motion.div>
  );
}
