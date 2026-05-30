/**
 * calculate-match.ts
 *
 * Multi-dimensional compatibility scoring between two profiles.
 * Weights:
 *   - Skills similarity          : 25%
 *   - Interests similarity       : 20%
 *   - Goals similarity           : 25%
 *   - LookingFor similarity      : 20%
 *   - Embedding cosine similarity: 10%
 */

import { cosineSimilarity } from "@/lib/vector/similarity";

export interface ProfileForMatch {
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
  embedding: number[];
  aiSummary?: string | null;
}

/** Jaccard similarity between two string arrays (case-insensitive). */
function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0.5; // both empty → neutral
  const setA = new Set(a.map((s) => s.toLowerCase().trim()));
  const setB = new Set(b.map((s) => s.toLowerCase().trim()));

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface MatchScoreBreakdown {
  /** Final score 0–100 */
  total: number;
  /** 0–100 skill compatibility */
  skills: number;
  /** 0–100 interest compatibility */
  interests: number;
  /** 0–100 goal alignment */
  goals: number;
  /** 0–100 lookingFor alignment */
  lookingFor: number;
  /** 0–100 embedding cosine similarity */
  embedding: number;
}

/**
 * Calculate a full compatibility score breakdown between two profiles.
 * Returns scores in 0–100 range.
 */
export function calculateMatchScore(
  a: ProfileForMatch,
  b: ProfileForMatch
): MatchScoreBreakdown {
  const skillsScore = jaccardSimilarity(a.skills, b.skills) * 100;
  const interestsScore = jaccardSimilarity(a.interests, b.interests) * 100;
  const goalsScore = jaccardSimilarity(a.goals, b.goals) * 100;
  const lookingForScore = jaccardSimilarity(a.lookingFor, b.lookingFor) * 100;

  // Cosine similarity ranges [-1, 1] → remap to [0, 100]
  const embeddingRaw =
    a.embedding.length > 0 && b.embedding.length > 0
      ? cosineSimilarity(a.embedding, b.embedding)
      : 0;
  const embeddingScore = ((embeddingRaw + 1) / 2) * 100;

  const total =
    skillsScore * 0.25 +
    interestsScore * 0.2 +
    goalsScore * 0.25 +
    lookingForScore * 0.2 +
    embeddingScore * 0.1;

  return {
    total: Math.round(Math.min(100, Math.max(0, total))),
    skills: Math.round(skillsScore),
    interests: Math.round(interestsScore),
    goals: Math.round(goalsScore),
    lookingFor: Math.round(lookingForScore),
    embedding: Math.round(embeddingScore),
  };
}

/** Tier label from score */
export function matchTier(score: number): "excellent" | "strong" | "good" | "low" {
  if (score >= 90) return "excellent";
  if (score >= 75) return "strong";
  if (score >= 60) return "good";
  return "low";
}
