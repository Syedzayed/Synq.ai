/**
 * Vector similarity utilities
 *
 * Cosine similarity for comparing user profile embeddings.
 * In production, offload this to pgvector or Supabase's vector extension.
 */

/**
 * Compute cosine similarity between two equal-length vectors.
 * Returns a value between -1 (opposite) and 1 (identical).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length.");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Rank a list of candidates by their embedding similarity to a query vector.
 */
export function rankBySimilarity<T extends { embedding: number[] }>(
  query: number[],
  candidates: T[],
  topK = 10
): (T & { score: number })[] {
  return candidates
    .map((c) => ({ ...c, score: cosineSimilarity(query, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
