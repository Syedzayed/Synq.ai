"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2 } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  role: string | null;
  organization: string | null;
  gender?: string | null;
  isOwnProfile?: boolean;
}

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  return gradients[(name?.charCodeAt(0) ?? 65) % gradients.length];
}

export function ProfileHeader({ name, role, organization, gender, isOwnProfile = false }: ProfileHeaderProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 4px 24px rgba(58,53,48,0.07)",
      }}
    >
      {/* Gradient strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: avatarGradient(name) }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-20 w-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
          style={{ background: avatarGradient(name) }}
        >
          {initial}
        </motion.div>

        {/* Identity */}
        <div className="flex-1">
          {isOwnProfile && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "#e07a5f" }}>
              Your Profile
            </p>
          )}
          <h1
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "#1e1a17",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {name}
          </h1>
          {(role || organization || (gender && gender !== "Prefer Not To Say")) && (
            <div className="flex flex-wrap items-center gap-3.5 mt-2">
              {role && (
                <span className="flex items-center gap-1.5 text-[14px]" style={{ color: "#6b6560" }}>
                  <Briefcase size={13} style={{ color: "#e07a5f" }} />
                  {role}
                </span>
              )}
              {organization && (
                <span className="flex items-center gap-1.5 text-[14px]" style={{ color: "#6b6560" }}>
                  <Building2 size={13} style={{ color: "#e07a5f" }} />
                  {organization}
                </span>
              )}
              {gender && gender !== "Prefer Not To Say" && (
                <span className="inline-flex items-center gap-1 text-[12.5px] px-2.5 py-0.5 rounded-lg font-medium" style={{ background: "rgba(224,122,95,0.08)", color: "#e07a5f", border: "1px solid rgba(224,122,95,0.18)" }}>
                  {gender}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
