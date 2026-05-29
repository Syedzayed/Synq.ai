/**
 * Profile Embedding Generator
 *
 * Composes a rich text document from all profile fields and generates
 * a Mistral embedding vector for semantic similarity matching.
 */
import "server-only";
import { generateEmbedding } from "./mistral";

export interface EmbeddingInput {
  name: string;
  role: string;
  organization?: string | null;
  skills: string[];
  interests: string[];
  projects?: string | null;
  goals: string[];
  lookingFor: string[];
  aiSummary?: string | null;
}

/**
 * Build a dense text representation of a profile for embedding.
 * Weights the summary highest, then skills/interests, then goals.
 */
function buildEmbeddingText(input: EmbeddingInput): string {
  const parts: string[] = [];

  if (input.aiSummary) parts.push(input.aiSummary);

  parts.push(`${input.name} is a ${input.role}${input.organization ? ` at ${input.organization}` : ""}.`);

  if (input.skills.length > 0)
    parts.push(`Skills: ${input.skills.join(", ")}.`);

  if (input.interests.length > 0)
    parts.push(`Interests: ${input.interests.join(", ")}.`);

  if (input.projects)
    parts.push(`Currently building: ${input.projects}.`);

  if (input.goals.length > 0)
    parts.push(`Goals: ${input.goals.join(", ")}.`);

  if (input.lookingFor.length > 0)
    parts.push(`Looking to connect with: ${input.lookingFor.join(", ")}.`);

  return parts.join(" ");
}

/**
 * Generate a 1024-dimensional embedding vector for a user profile.
 * Combine all profile fields + AI summary into a single document.
 */
export async function generateProfileEmbedding(
  input: EmbeddingInput
): Promise<number[]> {
  const text = buildEmbeddingText(input);
  return generateEmbedding(text);
}
