"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, UserPlus, Zap, Heart, Target,
  Users, FolderOpen, Brain, MapPin, Briefcase,
} from "lucide-react";
import { ProfileTags } from "./profile-tags";

const EASE = [0.22, 1, 0.36, 1] as const;

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  return gradients[name.charCodeAt(0) % gradients.length];
}

function BentoCard({
  icon: Icon,
  label,
  children,
  span2 = false,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl p-5 flex flex-col gap-3 ${span2 ? "sm:col-span-2" : ""}`}
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
          <Icon size={14} style={{ color: "#e07a5f" }} />
        </div>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          {label}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

export interface FullProfile {
  id: string;
  name: string;
  role: string | null;
  organization: string | null;
  aiSummary: string | null;
  skills: string[];
  interests: string[];
  projects: string | null;
  goals: string[];
  lookingFor: string[];
}

interface ProfileDetailsProps {
  profile: FullProfile;
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mb-6"
      >
        <Link
          href="/dashboard/discover"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:underline"
          style={{ color: "#9e9890" }}
        >
          <ArrowLeft size={13} />
          Back to Discover
        </Link>
      </motion.div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden"
        style={{
          background: "rgba(255,252,248,0.98)",
          border: "1px solid rgba(232,226,216,0.9)",
          boxShadow: "0 4px 24px rgba(58,53,48,0.07)",
        }}
      >
        {/* Gradient strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: avatarGradient(profile.name) }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
            style={{ background: avatarGradient(profile.name) }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>

          {/* Identity */}
          <div className="flex-1">
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
              {profile.name}
            </h1>
            {profile.role && (
              <p className="mt-1 flex items-center gap-1.5 text-[14px]" style={{ color: "#6b6560" }}>
                <Briefcase size={13} style={{ color: "#e07a5f" }} />
                {profile.role}
                {profile.organization && (
                  <>
                    <span style={{ color: "#c8c2ba" }}>·</span>
                    {profile.organization}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Connect CTA */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-colors"
            style={{
              background: "#f8f4ef",
              color: "#9e9890",
              border: "1px solid rgba(232,226,216,0.9)",
            }}
          >
            <UserPlus size={14} />
            Connect
          </button>
        </div>

        {/* AI Summary */}
        {profile.aiSummary && (
          <div
            className="mt-6 p-4 rounded-2xl flex items-start gap-3"
            style={{ background: "linear-gradient(135deg,rgba(224,122,95,0.06),rgba(244,162,97,0.04))", border: "1px solid rgba(224,122,95,0.15)" }}
          >
            <Brain size={15} style={{ color: "#e07a5f", flexShrink: 0, marginTop: 2 }} />
            <p className="text-[14px] leading-relaxed" style={{ color: "#3a3530" }}>
              &ldquo;{profile.aiSummary}&rdquo;
            </p>
          </div>
        )}
      </motion.div>

      {/* Bento grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {profile.skills.length > 0 && (
          <BentoCard icon={Zap} label="Skills">
            <ProfileTags items={profile.skills} max={20} variant="skill" />
          </BentoCard>
        )}

        {profile.interests.length > 0 && (
          <BentoCard icon={Heart} label="Interests">
            <ProfileTags items={profile.interests} max={20} variant="interest" />
          </BentoCard>
        )}

        {profile.goals.length > 0 && (
          <BentoCard icon={Target} label="Goals">
            <ProfileTags items={profile.goals} max={20} variant="goal" />
          </BentoCard>
        )}

        {profile.lookingFor.length > 0 && (
          <BentoCard icon={Users} label="Looking For">
            <ProfileTags items={profile.lookingFor} max={20} variant="neutral" />
          </BentoCard>
        )}

        {profile.projects && (
          <BentoCard icon={FolderOpen} label="Current Projects" span2>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "#3a3530" }}>
              {profile.projects}
            </p>
          </BentoCard>
        )}
      </motion.div>
    </div>
  );
}
