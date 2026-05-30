/**
 * match-engine.ts
 *
 * Core orchestration: given a userId, fetch all candidate profiles,
 * compute scores, return ranked results.
 */

import { db } from "@/lib/db/prisma";
import { calculateMatchScore, type MatchScoreBreakdown, type ProfileForMatch } from "./calculate-match";

export interface RankedMatch {
  userId: string;
  name: string;
  role: string | null;
  organization: string | null;
  aiSummary: string | null;
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
  score: MatchScoreBreakdown;
}

/**
 * Fetch the current user's profile and compare against ALL other completed profiles.
 * Returns candidates ranked by descending total match score.
 */
export async function rankCandidates(currentUserId: string): Promise<RankedMatch[]> {
  // Fetch the current user's profile
  const currentProfile = await db.profile.findUnique({
    where: { userId: currentUserId },
    select: {
      skills: true,
      interests: true,
      goals: true,
      lookingFor: true,
      embedding: true,
      aiSummary: true,
    },
  });

  if (!currentProfile) return [];

  const me: ProfileForMatch = {
    skills: currentProfile.skills,
    interests: currentProfile.interests,
    goals: currentProfile.goals,
    lookingFor: currentProfile.lookingFor,
    embedding: currentProfile.embedding,
    aiSummary: currentProfile.aiSummary,
  };

  // Fetch all other completed profiles
  const candidates = await db.profile.findMany({
    where: {
      userId: { not: currentUserId },
      completedAt: { not: null },
    },
    select: {
      userId: true,
      name: true,
      role: true,
      organization: true,
      aiSummary: true,
      skills: true,
      interests: true,
      goals: true,
      lookingFor: true,
      embedding: true,
    },
  });

  if (candidates.length === 0) return [];

  // Score each candidate
  const ranked = candidates.map((c) => {
    const candidateProfile: ProfileForMatch = {
      skills: c.skills,
      interests: c.interests,
      goals: c.goals,
      lookingFor: c.lookingFor,
      embedding: c.embedding,
    };

    const score = calculateMatchScore(me, candidateProfile);

    return {
      userId: c.userId,
      name: c.name ?? "Anonymous",
      role: c.role,
      organization: c.organization,
      aiSummary: c.aiSummary,
      skills: c.skills,
      interests: c.interests,
      goals: c.goals,
      lookingFor: c.lookingFor,
      score,
    };
  });

  // Sort descending by total score
  return ranked.sort((a, b) => b.score.total - a.score.total);
}
