"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Briefcase } from "lucide-react";
import { MatchScore } from "@/components/matches/match-score";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";

interface TopMatchesWidgetProps {
  matches: StoredRecommendation[];
}

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  return gradients[(name.charCodeAt(0) ?? 65) % gradients.length];
}

export function TopMatchesWidget({ matches }: TopMatchesWidgetProps) {
  const top3 = matches.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            style={{ background: "rgba(224,122,95,0.10)" }}
          >
            <Sparkles size={13} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>
            Top Matches
          </p>
        </div>
        <Link
          href="/dashboard/discover"
          className="flex items-center gap-1 text-[11.5px] font-medium transition-colors hover:underline"
          style={{ color: "#e07a5f" }}
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      {top3.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-[13px]" style={{ color: "#9e9890" }}>
            No matches yet.{" "}
            <Link href="/dashboard/discover" className="underline" style={{ color: "#e07a5f" }}>
              Generate recommendations
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {top3.map((match, i) => {
            const name = match.matchedProfile.name ?? "Anonymous";
            return (
              <Link
                key={match.matchedUserId}
                href={`/dashboard/discover/${match.matchedUserId}`}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[rgba(232,226,216,0.3)]"
              >
                {/* Rank */}
                <span
                  className="text-[11px] font-bold w-4 text-center flex-shrink-0"
                  style={{ color: "#b8b2aa" }}
                >
                  {i + 1}
                </span>
                {/* Avatar */}
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                  style={{ background: avatarGradient(name) }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "#1e1a17" }}>
                    {name}
                  </p>
                  {match.matchedProfile.role && (
                    <p className="text-[11.5px] flex items-center gap-1 truncate" style={{ color: "#9e9890" }}>
                      <Briefcase size={9} />
                      {match.matchedProfile.role}
                    </p>
                  )}
                </div>
                {/* Score */}
                <MatchScore score={match.score} size="sm" />
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
