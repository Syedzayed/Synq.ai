import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getMatchDetails } from "@/lib/match/recommendation-service";
import { getConnectionStatus } from "@/actions/connections";
import { ProfileDetails } from "@/components/discover/profile-details";
import { CompatibilityAnalysis, OverlapTags } from "@/components/matches/compatibility-analysis";
import { Zap, Heart, Target, Users } from "lucide-react";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const profile = await db.profile.findUnique({
    where: { userId },
    select: { name: true, role: true },
  });

  if (!profile) return { title: "Profile — Synq" };

  return {
    title: `${profile.name ?? "Profile"} — Synq`,
    description: `${profile.name}'s profile on Synq${profile.role ? ` — ${profile.role}` : ""}.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  // Fetch target profile
  const profile = await db.profile.findUnique({
    where: { userId, completedAt: { not: null } },
    select: {
      userId: true,
      name: true,
      role: true,
      organization: true,
      aiSummary: true,
      skills: true,
      interests: true,
      projects: true,
      goals: true,
      lookingFor: true,
      gender: true,
    },
  });

  if (!profile) notFound();

  // Get current user, match details, and connection status
  const currentUser = await getServerUser();
  const isOwnProfile = currentUser?.id === userId;

  const [matchDetails, connectionData, myProfile] = await Promise.all([
    currentUser && !isOwnProfile ? getMatchDetails(currentUser.id, userId) : Promise.resolve(null),
    currentUser && !isOwnProfile ? getConnectionStatus(userId) : Promise.resolve(null),
    currentUser && !isOwnProfile
      ? db.profile.findUnique({
          where: { userId: currentUser.id },
          select: { skills: true, interests: true, goals: true, lookingFor: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Core profile details (existing component) */}
      <ProfileDetails
        profile={{
          id: profile.userId,
          name: profile.name ?? "Anonymous",
          role: profile.role,
          organization: profile.organization,
          aiSummary: profile.aiSummary,
          skills: profile.skills,
          interests: profile.interests,
          projects: profile.projects,
          goals: profile.goals,
          lookingFor: profile.lookingFor,
          gender: profile.gender,
        }}
        connectionStatus={connectionData?.status ?? null}
        connectionId={connectionData?.connectionId ?? null}
        isSender={connectionData?.isSender ?? true}
        isOwnProfile={isOwnProfile}
      />

      {/* Match Analysis — only shown when viewing another user's profile */}
      {matchDetails && myProfile && (
        <div className="mt-8">
          <div className="mb-4">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: "#e07a5f" }}
            >
              AI Analysis
            </p>
            <h2
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
                color: "#1e1a17",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Match Analysis
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: "#6b6560" }}>
              How compatible are you with {profile.name ?? "this person"}?
            </p>
          </div>

          <CompatibilityAnalysis
            score={matchDetails.score}
            reason={matchDetails.reason}
            breakdown={matchDetails.breakdown}
          />

          {/* Overlap bento cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Skills overlap */}
            {myProfile.skills.length > 0 && profile.skills.length > 0 && (
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,252,248,0.98)",
                  border: "1px solid rgba(232,226,216,0.9)",
                  boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.10)" }}>
                    <Zap size={14} style={{ color: "#e07a5f" }} />
                  </div>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
                    Shared Skills
                  </p>
                </div>
                <OverlapTags a={myProfile.skills} b={profile.skills} variant="skill" />
              </div>
            )}

            {/* Interests overlap */}
            {myProfile.interests.length > 0 && profile.interests.length > 0 && (
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,252,248,0.98)",
                  border: "1px solid rgba(232,226,216,0.9)",
                  boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.10)" }}>
                    <Heart size={14} style={{ color: "#e07a5f" }} />
                  </div>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
                    Shared Interests
                  </p>
                </div>
                <OverlapTags a={myProfile.interests} b={profile.interests} variant="interest" />
              </div>
            )}

            {/* Goals overlap */}
            {myProfile.goals.length > 0 && profile.goals.length > 0 && (
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,252,248,0.98)",
                  border: "1px solid rgba(232,226,216,0.9)",
                  boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.10)" }}>
                    <Target size={14} style={{ color: "#e07a5f" }} />
                  </div>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
                    Aligned Goals
                  </p>
                </div>
                <OverlapTags a={myProfile.goals} b={profile.goals} variant="goal" />
              </div>
            )}

            {/* LookingFor overlap */}
            {myProfile.lookingFor.length > 0 && profile.lookingFor.length > 0 && (
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,252,248,0.98)",
                  border: "1px solid rgba(232,226,216,0.9)",
                  boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.10)" }}>
                    <Users size={14} style={{ color: "#e07a5f" }} />
                  </div>
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
                    Looking For
                  </p>
                </div>
                <OverlapTags a={myProfile.lookingFor} b={profile.lookingFor} variant="neutral" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
