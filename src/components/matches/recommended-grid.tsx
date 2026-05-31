"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Sparkles, ArrowRight } from "lucide-react";
import { MatchCard } from "./match-card";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";
import type { ConnectionMapEntry } from "./discover-matches-client";

interface RecommendedGridProps {
  recommendations: StoredRecommendation[];
  connectionMap?: Record<string, ConnectionMapEntry>;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function RecommendedGrid({
  recommendations,
  connectionMap = {},
  onRegenerate,
  isRegenerating = false,
}: RecommendedGridProps) {
  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-24 text-center px-4"
      >
        {/* Animated orb */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6 relative"
          style={{
            background: "rgba(224,122,95,0.08)",
            border: "1px solid rgba(224,122,95,0.15)",
          }}
        >
          <Users size={28} style={{ color: "#e07a5f" }} />
          <div
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
          >
            <Sparkles size={10} className="text-white" />
          </div>
        </motion.div>

        <h2
          className="mb-2"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "1.8rem",
            color: "#1e1a17",
            fontWeight: 400,
          }}
        >
          No matches found yet.
        </h2>
        <p className="text-[14px] max-w-sm mb-6" style={{ color: "#9e9890" }}>
          Invite more people or update your profile details to unlock intelligent recommendations.
        </p>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all"
            style={{
              background: isRegenerating
                ? "rgba(224,122,95,0.5)"
                : "linear-gradient(135deg,#e07a5f,#d4694f)",
              color: "white",
              boxShadow: "0 2px 12px rgba(224,122,95,0.25)",
              cursor: isRegenerating ? "not-allowed" : "pointer",
            }}
          >
            <Sparkles size={13} />
            {isRegenerating ? "Generating…" : "Generate Recommendations"}
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row with regen button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "#e07a5f" }}>
            AI Powered
          </p>
          <h2
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              color: "#1e1a17",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Recommended For You
          </h2>
          <p className="mt-1 text-[13px]" style={{ color: "#6b6560" }}>
            {recommendations.length} intelligent{" "}
            {recommendations.length === 1 ? "match" : "matches"} based on your profile
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all"
              style={{
                background: "rgba(224,122,95,0.08)",
                color: "#e07a5f",
                border: "1px solid rgba(224,122,95,0.2)",
                cursor: isRegenerating ? "not-allowed" : "pointer",
                opacity: isRegenerating ? 0.6 : 1,
              }}
            >
              <Sparkles size={12} />
              {isRegenerating ? "Refreshing…" : "Refresh"}
            </button>
          )}
          <Link
            href="/dashboard/matches"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all"
            style={{
              background: "rgba(224,122,95,0.08)",
              color: "#e07a5f",
              border: "1px solid rgba(224,122,95,0.2)",
            }}
          >
            All Matches
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {recommendations.map((rec, i) => {
          const conn = connectionMap[rec.matchedUserId];
          return (
            <MatchCard
              key={rec.matchedUserId}
              recommendation={rec}
              index={i}
              initialConnectionStatus={conn?.status ?? null}
              connectionId={conn?.connectionId ?? null}
              isSender={conn?.isSender ?? true}
            />
          );
        })}
      </div>
    </div>
  );
}
