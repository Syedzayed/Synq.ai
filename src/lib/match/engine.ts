/**
 * Matching engine — orchestrates AI-powered user matching.
 *
 * Flow:
 *  1. Fetch current user's profile + embedding
 *  2. Fetch candidate profiles with embeddings
 *  3. Rank by cosine similarity
 *  4. (Optional) Re-rank with LLM for contextual fit
 */

import { rankBySimilarity } from "@/lib/vector/similarity";

export interface MatchCandidate {
  id: string;
  userId: string;
  name?: string | null;
  bio?: string | null;
  skills: string[];
  goals: string[];
  embedding: number[];
}

export interface MatchResult extends MatchCandidate {
  score: number;
}

/**
 * Find top-K matches for a given profile embedding.
 */
export function findMatches(
  queryEmbedding: number[],
  candidates: MatchCandidate[],
  topK = 10
): MatchResult[] {
  return rankBySimilarity(queryEmbedding, candidates, topK);
}
