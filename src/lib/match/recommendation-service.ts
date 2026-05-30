/**
 * recommendation-service.ts
 *
 * High-level service that:
 *   1. Runs the match engine to rank all candidates
 *   2. Generates AI explanations for each match via Mistral
 *   3. Upserts results into MatchRecommendation (no duplicate, allows regen)
 *   4. Returns stored recommendations for display
 */

import { db } from "@/lib/db/prisma";
import { chatCompletion } from "@/lib/ai/mistral";
import { rankCandidates, type RankedMatch } from "./match-engine";
import { createNotification } from "@/actions/notifications";

const TOP_K = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredRecommendation {
  matchedUserId: string;
  score: number;
  reason: string;
  createdAt: Date;
  matchedProfile: {
    name: string | null;
    role: string | null;
    organization: string | null;
    aiSummary: string | null;
    skills: string[];
    interests: string[];
    goals: string[];
    lookingFor: string[];
  };
}

// ─── Explanation generation ────────────────────────────────────────────────────

interface ProfileSnapshot {
  name: string;
  role: string | null;
  aiSummary: string | null;
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
}

async function generateExplanation(
  me: ProfileSnapshot,
  them: ProfileSnapshot,
  scoreTotal: number
): Promise<string> {
  const prompt = `You are a professional networking advisor.
Write a 2-4 sentence explanation of why two professionals would be a great match on a networking platform.
Be specific, factual, and grounded in the data below. Never fabricate information.
Keep it warm, concise, and insightful.

User A:
- Name: ${me.name}
- Role: ${me.role ?? "not specified"}
- AI Summary: ${me.aiSummary ?? "not available"}
- Skills: ${me.skills.join(", ") || "none listed"}
- Interests: ${me.interests.join(", ") || "none listed"}
- Goals: ${me.goals.join(", ") || "none listed"}
- Looking For: ${me.lookingFor.join(", ") || "none listed"}

User B:
- Name: ${them.name}
- Role: ${them.role ?? "not specified"}
- AI Summary: ${them.aiSummary ?? "not available"}
- Skills: ${them.skills.join(", ") || "none listed"}
- Interests: ${them.interests.join(", ") || "none listed"}
- Goals: ${them.goals.join(", ") || "none listed"}
- Looking For: ${them.lookingFor.join(", ") || "none listed"}

Match score: ${scoreTotal}%

Return ONLY the explanation paragraph. No preamble, no labels, no quotes.`;

  try {
    const text = await chatCompletion(
      [{ role: "user", content: prompt }],
      "mistral-small-latest"
    );
    return text.trim();
  } catch {
    // Graceful fallback — never block recommendations if Mistral is unavailable
    return buildFallbackReason(me, them);
  }
}

function buildFallbackReason(me: ProfileSnapshot, them: ProfileSnapshot): string {
  const sharedSkills = me.skills.filter((s) =>
    them.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );
  const sharedInterests = me.interests.filter((s) =>
    them.interests.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );

  const parts: string[] = [];
  if (sharedSkills.length > 0)
    parts.push(`both bring expertise in ${sharedSkills.slice(0, 3).join(", ")}`);
  if (sharedInterests.length > 0)
    parts.push(`share interests in ${sharedInterests.slice(0, 2).join(" and ")}`);

  return parts.length > 0
    ? `These two professionals ${parts.join(" and ")}, making them well-positioned to collaborate and learn from each other.`
    : `These two professionals have complementary profiles that suggest strong collaboration potential.`;
}

// ─── Main service functions ────────────────────────────────────────────────────

/**
 * Generate (or regenerate) recommendations for a user.
 * Existing recommendations for the same pair are overwritten (upsert).
 */
export async function generateRecommendations(currentUserId: string): Promise<void> {
  // Fetch current user profile snapshot for explanation generation
  const currentProfile = await db.profile.findUnique({
    where: { userId: currentUserId },
    select: { name: true, role: true, aiSummary: true, skills: true, interests: true, goals: true, lookingFor: true },
  });
  if (!currentProfile) return;

  const meSnapshot: ProfileSnapshot = {
    name: currentProfile.name ?? "User",
    role: currentProfile.role,
    aiSummary: currentProfile.aiSummary,
    skills: currentProfile.skills,
    interests: currentProfile.interests,
    goals: currentProfile.goals,
    lookingFor: currentProfile.lookingFor,
  };

  // Rank candidates
  const ranked = await rankCandidates(currentUserId);
  const topCandidates = ranked.slice(0, TOP_K);

  if (topCandidates.length === 0) return;

  // Generate explanations and upsert
  for (const candidate of topCandidates) {
    const themSnapshot: ProfileSnapshot = {
      name: candidate.name,
      role: candidate.role,
      aiSummary: candidate.aiSummary,
      skills: candidate.skills,
      interests: candidate.interests,
      goals: candidate.goals,
      lookingFor: candidate.lookingFor,
    };

    const reason = await generateExplanation(meSnapshot, themSnapshot, candidate.score.total);

    const result = await db.matchRecommendation.upsert({
      where: {
        userId_matchedUserId: {
          userId: currentUserId,
          matchedUserId: candidate.userId,
        },
      },
      create: {
        userId: currentUserId,
        matchedUserId: candidate.userId,
        score: candidate.score.total,
        reason,
      },
      update: {
        score: candidate.score.total,
        reason,
        createdAt: new Date(),
      },
    });

    // Fire a NEW_MATCH notification for high-compatibility matches (≥75%)
    if (candidate.score.total >= 75) {
      await createNotification({
        userId: currentUserId,
        type: "NEW_MATCH",
        title: "New High-Compatibility Match",
        message: `You have a ${Math.round(candidate.score.total)}% match with ${candidate.name ?? "someone"}. Check it out!`,
        relatedUserId: candidate.userId,
        relatedEntityId: result.id,
      });
    }
  }
}

/**
 * Load stored recommendations for a user, enriched with matched user's profile.
 * Falls back to generating fresh ones if none exist.
 */
export async function getRecommendations(
  currentUserId: string,
  limit = TOP_K
): Promise<StoredRecommendation[]> {
  const stored = await db.matchRecommendation.findMany({
    where: { userId: currentUserId },
    orderBy: { score: "desc" },
    take: limit,
    include: {
      matchedUser: {
        include: { profile: true },
      },
    },
  });

  return stored
    .filter((r) => r.matchedUser.profile?.completedAt != null)
    .map((r) => ({
      matchedUserId: r.matchedUserId,
      score: r.score,
      reason: r.reason,
      createdAt: r.createdAt,
      matchedProfile: {
        name: r.matchedUser.profile?.name ?? null,
        role: r.matchedUser.profile?.role ?? null,
        organization: r.matchedUser.profile?.organization ?? null,
        aiSummary: r.matchedUser.profile?.aiSummary ?? null,
        skills: r.matchedUser.profile?.skills ?? [],
        interests: r.matchedUser.profile?.interests ?? [],
        goals: r.matchedUser.profile?.goals ?? [],
        lookingFor: r.matchedUser.profile?.lookingFor ?? [],
      },
    }));
}

/**
 * Get a single stored recommendation for a specific pair (for detail page).
 */
export async function getMatchDetails(
  currentUserId: string,
  targetUserId: string
): Promise<{ score: number; reason: string; breakdown: Record<string, number> } | null> {
  const stored = await db.matchRecommendation.findUnique({
    where: {
      userId_matchedUserId: { userId: currentUserId, matchedUserId: targetUserId },
    },
  });

  if (!stored) {
    // Compute on the fly (no stored record yet)
    const ranked = await rankCandidates(currentUserId);
    const match = ranked.find((r) => r.userId === targetUserId);
    if (!match) return null;
    return {
      score: match.score.total,
      reason: "No AI explanation generated yet.",
      breakdown: {
        skills: match.score.skills,
        interests: match.score.interests,
        goals: match.score.goals,
        lookingFor: match.score.lookingFor,
        embedding: match.score.embedding,
      },
    };
  }

  // Re-compute breakdown live (not stored in DB — ephemeral)
  const ranked = await rankCandidates(currentUserId);
  const match = ranked.find((r) => r.userId === targetUserId);

  return {
    score: stored.score,
    reason: stored.reason,
    breakdown: match
      ? {
          skills: match.score.skills,
          interests: match.score.interests,
          goals: match.score.goals,
          lookingFor: match.score.lookingFor,
          embedding: match.score.embedding,
        }
      : {},
  };
}
