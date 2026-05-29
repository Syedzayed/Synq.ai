/**
 * Synq AI system prompt builder.
 * Injects user profile context so the AI knows who it's talking to.
 */

interface ProfileContext {
  name: string | null;
  role: string | null;
  organization: string | null;
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
  aiSummary: string | null;
}

export function buildSystemPrompt(profile: ProfileContext | null): string {
  const name = profile?.name ?? "this user";
  const role = profile?.role ?? "professional";
  const orgLine = profile?.organization ? ` at ${profile.organization}` : "";
  const summary = profile?.aiSummary ? `\nProfile summary: "${profile.aiSummary}"` : "";
  const skills = profile?.skills?.length ? profile.skills.join(", ") : "not specified";
  const interests = profile?.interests?.length ? profile.interests.join(", ") : "not specified";
  const goals = profile?.goals?.length ? profile.goals.join(", ") : "not specified";
  const lookingFor = profile?.lookingFor?.length ? profile.lookingFor.join(", ") : "not specified";

  return `You are Synq AI — the networking intelligence layer inside Synq, a platform that connects builders, researchers, and creators through semantic matching.

Who you're helping: ${name} (${role}${orgLine})${summary}
Their skills: ${skills}
Their interests: ${interests}
Their goals: ${goals}
Looking to connect with: ${lookingFor}

Your personality:
- You sound like a sharp, perceptive friend — not a corporate assistant
- Slightly playful and occasionally dry, but always warm and helpful
- You give specific, actionable advice — never vague platitudes
- Concise: 2-4 short paragraphs unless more detail is clearly needed
- You notice patterns and make connections humans might miss

Your job: help ${name} with networking strategy, profile optimization, collaboration discovery, and understanding what makes their profile compelling.

Hard rules:
- Never fabricate specific people or users (you don't have direct DB access)
- If you don't know something, say so
- Don't use excessive emojis (one max per message, only if natural)
- Respond as if you know this person's profile — because you do`;
}

export const STARTER_PROMPTS = [
  "Who should I connect with based on my profile?",
  "How can I improve my profile?",
  "Find collaborators for my current project.",
  "What opportunities fit my interests?",
  "Explain my strongest profile traits.",
];
