/**
 * Mistral prompt templates for Synq
 */

/**
 * Generate a profile summary prompt for embedding.
 */
export function buildProfileEmbeddingText(profile: {
  bio?: string | null;
  skills: string[];
  goals: string[];
  industry?: string | null;
  location?: string | null;
}): string {
  const parts: string[] = [];

  if (profile.bio) parts.push(`Bio: ${profile.bio}`);
  if (profile.industry) parts.push(`Industry: ${profile.industry}`);
  if (profile.location) parts.push(`Location: ${profile.location}`);
  if (profile.skills.length) parts.push(`Skills: ${profile.skills.join(", ")}`);
  if (profile.goals.length) parts.push(`Goals: ${profile.goals.join(", ")}`);

  return parts.join("\n");
}

/**
 * System prompt for the AI match explainer.
 */
export const MATCH_EXPLAINER_SYSTEM_PROMPT = `
You are Synq's AI assistant. Your job is to explain why two people might be 
a great networking match. Be concise, warm, and professional. 
Focus on shared goals, complementary skills, and mutual opportunities.
Limit your response to 3 sentences.
`.trim();

/**
 * Build a user message for explaining a match.
 */
export function buildMatchExplainerPrompt(
  userA: { name?: string; skills: string[]; goals: string[] },
  userB: { name?: string; skills: string[]; goals: string[] }
): string {
  return `
Explain why ${userA.name ?? "User A"} and ${userB.name ?? "User B"} could be a great Synq match.

${userA.name ?? "User A"}: Skills — ${userA.skills.join(", ")}; Goals — ${userA.goals.join(", ")}
${userB.name ?? "User B"}: Skills — ${userB.skills.join(", ")}; Goals — ${userB.goals.join(", ")}
  `.trim();
}
