/**
 * AI Profile Summarizer
 *
 * Generates a 2–3 sentence professional bio using Mistral's chat API.
 * Called after onboarding data is collected.
 */
import "server-only";
import { chatCompletion } from "./mistral";

export interface SummaryInput {
  name: string;
  role: string;
  organization?: string | null;
  skills: string[];
  interests: string[];
  projects?: string | null;
  goals: string[];
  lookingFor: string[];
}

/**
 * Generate a natural-language professional summary for a user profile.
 * Returns a 2–3 sentence third-person bio.
 */
export async function generateProfileSummary(
  input: SummaryInput
): Promise<string> {
  const {
    name,
    role,
    organization,
    skills,
    interests,
    projects,
    goals,
    lookingFor,
  } = input;

  const orgLine = organization ? ` at ${organization}` : "";
  const projectLine = projects
    ? `\nCurrently working on: ${projects}`
    : "";

  const prompt = `Write a professional 2–3 sentence bio in third person for the following person. 
Be specific, warm, and authentic. Do NOT use generic filler phrases like "passionate about" or "dedicated professional".
Focus on what makes them distinctive.

Name: ${name}
Role: ${role}${orgLine}
Skills: ${skills.join(", ")}
Interests: ${interests.join(", ")}${projectLine}
Goals: ${goals.join(", ")}
Looking to connect with: ${lookingFor.join(", ")}

Write only the bio text, no labels or formatting.`;

  const summary = await chatCompletion(
    [
      {
        role: "system",
        content:
          "You are a professional bio writer for a tech networking platform. Write concise, specific, authentic bios. Never use generic phrases. Write in third person.",
      },
      { role: "user", content: prompt },
    ],
    "mistral-small-latest"
  );

  return summary.trim();
}
