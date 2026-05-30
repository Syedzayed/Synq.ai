"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Zap, Heart, Target, Users, FolderOpen } from "lucide-react";
import { ProfileHeader } from "./profile-header";
import { ProfileCard } from "./profile-card";
import { ProfileCompleteness } from "./profile-completeness";
import { AiSummaryCard } from "./ai-summary-card";
import { ProfileInsights } from "./profile-insights";
import { EditProfileForm } from "./edit-profile-form";
import { calculateCompleteness } from "@/lib/profile/completeness";
import type { ProfileUpdateInput } from "@/actions/profile-management";

function Tag({ text, variant = "neutral" }: { text: string; variant?: "skill" | "interest" | "goal" | "neutral" }) {
  const styles = {
    skill:    { background: "rgba(224,122,95,0.08)", color: "#c9604a", border: "1px solid rgba(224,122,95,0.18)" },
    interest: { background: "rgba(244,162,97,0.08)", color: "#c47f30", border: "1px solid rgba(244,162,97,0.22)" },
    goal:     { background: "rgba(58,53,48,0.06)",   color: "#3a3530", border: "1px solid rgba(58,53,48,0.12)"  },
    neutral:  { background: "#f8f4ef",               color: "#3a3530", border: "1px solid rgba(232,226,216,0.9)" },
  }[variant];

  return (
    <span className="px-2.5 py-1 rounded-full text-[12px] font-medium" style={styles}>
      {text}
    </span>
  );
}

export interface ProfileData {
  name: string;
  role: string | null;
  organization: string | null;
  skills: string[];
  interests: string[];
  projects: string | null;
  goals: string[];
  lookingFor: string[];
  aiSummary: string | null;
}

interface ProfilePageClientProps {
  profile: ProfileData;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const [editOpen, setEditOpen] = useState(false);

  const completeness = calculateCompleteness({
    name: profile.name,
    role: profile.role,
    organization: profile.organization,
    skills: profile.skills,
    interests: profile.interests,
    projects: profile.projects,
    goals: profile.goals,
    lookingFor: profile.lookingFor,
    aiSummary: profile.aiSummary,
  });

  const editInitial: ProfileUpdateInput = {
    name: profile.name,
    role: profile.role ?? "",
    organization: profile.organization ?? "",
    skills: profile.skills,
    interests: profile.interests,
    projects: profile.projects ?? "",
    goals: profile.goals,
    lookingFor: profile.lookingFor,
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Page label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "#e07a5f" }}>
              Profile
            </p>
            <h1
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "#1e1a17",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              My Profile
            </h1>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all duration-200 hover:shadow-md"
            style={{
              background: "linear-gradient(135deg,#e07a5f,#d4694f)",
              color: "white",
              boxShadow: "0 2px 10px rgba(224,122,95,0.25)",
            }}
          >
            <Pencil size={13} />
            Edit Profile
          </button>
        </motion.div>

        {/* Header card */}
        <div className="mb-5">
          <ProfileHeader
            name={profile.name}
            role={profile.role}
            organization={profile.organization}
            isOwnProfile
          />
        </div>

        {/* Main bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <ProfileCompleteness result={completeness} />
            <AiSummaryCard summary={profile.aiSummary} />
            <ProfileInsights />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-min">
            {/* Skills */}
            <ProfileCard
              title="Skills"
              icon={<Zap size={13} style={{ color: "#e07a5f" }} />}
              delay={0.08}
              empty={profile.skills.length === 0}
              emptyMessage="No skills added yet — add some to improve your matches."
            >
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => <Tag key={s} text={s} variant="skill" />)}
              </div>
            </ProfileCard>

            {/* Interests */}
            <ProfileCard
              title="Interests"
              icon={<Heart size={13} style={{ color: "#e07a5f" }} />}
              delay={0.1}
              empty={profile.interests.length === 0}
              emptyMessage="Add interests to attract like-minded people."
            >
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((s) => <Tag key={s} text={s} variant="interest" />)}
              </div>
            </ProfileCard>

            {/* Goals */}
            <ProfileCard
              title="Goals"
              icon={<Target size={13} style={{ color: "#e07a5f" }} />}
              delay={0.12}
              empty={profile.goals.length === 0}
              emptyMessage="Share your goals to find aligned collaborators."
            >
              <div className="flex flex-wrap gap-1.5">
                {profile.goals.map((s) => <Tag key={s} text={s} variant="goal" />)}
              </div>
            </ProfileCard>

            {/* Looking For */}
            <ProfileCard
              title="Looking For"
              icon={<Users size={13} style={{ color: "#e07a5f" }} />}
              delay={0.14}
              empty={profile.lookingFor.length === 0}
              emptyMessage="Tell people what kind of connections you're seeking."
            >
              <div className="flex flex-wrap gap-1.5">
                {profile.lookingFor.map((s) => <Tag key={s} text={s} variant="neutral" />)}
              </div>
            </ProfileCard>

            {/* Projects — full width */}
            <div className="sm:col-span-2">
              <ProfileCard
                title="Current Projects"
                icon={<FolderOpen size={13} style={{ color: "#e07a5f" }} />}
                delay={0.16}
                empty={!profile.projects}
                emptyMessage="Describe what you're building — it helps attract collaborators."
              >
                <p className="text-[14px] leading-relaxed" style={{ color: "#3a3530" }}>
                  {profile.projects}
                </p>
              </ProfileCard>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <EditProfileForm
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editInitial}
      />
    </>
  );
}
