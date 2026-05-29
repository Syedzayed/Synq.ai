"use client";

import { motion } from "framer-motion";
import { ProfileCard, type DiscoverProfile } from "./profile-card";
import { Users } from "lucide-react";

interface DiscoverGridProps {
  profiles: DiscoverProfile[];
}

export function DiscoverGrid({ profiles }: DiscoverGridProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(224,122,95,0.08)", border: "1px solid rgba(224,122,95,0.15)" }}
        >
          <Users size={24} style={{ color: "#e07a5f" }} />
        </div>
        <h2
          className="mb-2"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "1.5rem",
            color: "#1e1a17",
            fontWeight: 400,
          }}
        >
          No profiles yet
        </h2>
        <p className="text-[14px] max-w-xs" style={{ color: "#9e9890" }}>
          Be the first to complete your profile. Others will start appearing here as they join Synq.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {profiles.map((profile, i) => (
        <ProfileCard key={profile.id} profile={profile} index={i} />
      ))}
    </motion.div>
  );
}
