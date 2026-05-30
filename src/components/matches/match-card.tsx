"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, UserPlus, Briefcase } from "lucide-react";
import { ProfileTags } from "@/components/discover/profile-tags";
import { MatchScore } from "./match-score";
import { MatchExplanation } from "./match-explanation";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";

interface MatchCardProps {
  recommendation: StoredRecommendation;
  index?: number;
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

export function MatchCard({ recommendation, index = 0 }: MatchCardProps) {
  const { matchedUserId, score, reason, matchedProfile } = recommendation;
  const name = matchedProfile.name ?? "Anonymous";
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 14px 36px rgba(58,53,48,0.1)" }}
      className="flex flex-col rounded-3xl overflow-hidden transition-shadow duration-300"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
      }}
    >
      {/* Gradient top strip */}
      <div className="h-1.5 w-full" style={{ background: avatarGradient(name) }} />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Identity row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
              style={{ background: avatarGradient(name) }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold truncate" style={{ color: "#1e1a17" }}>
                {name}
              </p>
              {matchedProfile.role && (
                <p className="text-[12.5px] flex items-center gap-1 mt-0.5 truncate" style={{ color: "#9e9890" }}>
                  <Briefcase size={10} />
                  {matchedProfile.role}
                  {matchedProfile.organization && ` · ${matchedProfile.organization}`}
                </p>
              )}
            </div>
          </div>
          <MatchScore score={score} size="sm" />
        </div>

        {/* AI Summary */}
        {matchedProfile.aiSummary && (
          <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: "#6b6560" }}>
            {matchedProfile.aiSummary}
          </p>
        )}

        {/* Skills */}
        {matchedProfile.skills.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#b8b2aa" }}>
              Skills
            </p>
            <ProfileTags items={matchedProfile.skills} max={4} variant="skill" />
          </div>
        )}

        {/* AI Match explanation */}
        <MatchExplanation reason={reason} compact />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div
          className="flex gap-2 pt-2"
          style={{ borderTop: "1px solid rgba(232,226,216,0.7)" }}
        >
          <Link
            href={`/dashboard/discover/${matchedUserId}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-200 hover:shadow-sm"
            style={{
              background: "linear-gradient(135deg,#e07a5f 0%,#d4694f 100%)",
              color: "white",
              boxShadow: "0 2px 8px rgba(224,122,95,0.25)",
            }}
          >
            View Profile
            <ArrowRight size={13} />
          </Link>
          <button
            type="button"
            title="Connect (coming soon)"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-[13px] font-semibold transition-colors"
            style={{
              background: "#f8f4ef",
              color: "#9e9890",
              border: "1px solid rgba(232,226,216,0.9)",
            }}
          >
            <UserPlus size={13} />
            Connect
          </button>
        </div>
      </div>
    </motion.article>
  );
}
