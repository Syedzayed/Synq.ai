"use server";

/**
 * profile-management.ts — Server Actions for /dashboard/profile
 *
 * Security model:
 *  - All actions verify the caller via getServerUser()
 *  - Profile updates are scoped exclusively to the authenticated user's own record
 *  - No userId is accepted from the client — always derived from the session
 */

import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";
import { generateProfileSummary } from "@/lib/ai/summarizer";
import { generateProfileEmbedding } from "@/lib/ai/embeddings";
import { generateRecommendations } from "@/lib/match/recommendation-service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileUpdateInput {
  name: string;
  role: string;
  organization: string;
  skills: string[];
  interests: string[];
  projects: string;
  goals: string[];
  lookingFor: string[];
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeTags(tags: string[]): string[] {
  return tags
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 20);
}

// ─── updateProfile ─────────────────────────────────────────────────────────────

export async function updateProfile(input: ProfileUpdateInput): Promise<ActionResult> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  if (!input.name?.trim()) return { success: false, error: "Name is required." };
  if (!input.role?.trim()) return { success: false, error: "Role is required." };

  const skills = sanitizeTags(input.skills);
  if (skills.length === 0) return { success: false, error: "Add at least one skill." };

  try {
    await db.profile.update({
      where: { userId: user.id },
      data: {
        name: input.name.trim(),
        role: input.role.trim(),
        organization: input.organization?.trim() || null,
        skills,
        interests: sanitizeTags(input.interests),
        projects: input.projects?.trim() || null,
        goals: sanitizeTags(input.goals),
        lookingFor: sanitizeTags(input.lookingFor),
        updatedAt: new Date(),
      },
    });

    // Sync name to User row too
    await db.user.update({
      where: { id: user.id },
      data: { name: input.name.trim() },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("[updateProfile]", err);
    return { success: false, error: "Failed to update profile." };
  }
}

// ─── regenerateSummary ────────────────────────────────────────────────────────

export async function regenerateSummary(): Promise<ActionResult & { summary?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: {
      name: true, role: true, organization: true,
      skills: true, interests: true, projects: true,
      goals: true, lookingFor: true,
    },
  });

  if (!profile) return { success: false, error: "Profile not found." };
  if (!profile.name || !profile.role) return { success: false, error: "Complete your profile first." };

  try {
    const summary = await generateProfileSummary({
      name: profile.name,
      role: profile.role,
      organization: profile.organization,
      skills: profile.skills,
      interests: profile.interests,
      projects: profile.projects,
      goals: profile.goals,
      lookingFor: profile.lookingFor,
    });

    await db.profile.update({
      where: { userId: user.id },
      data: { aiSummary: summary },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true, summary };
  } catch (err) {
    console.error("[regenerateSummary]", err);
    return { success: false, error: "Failed to regenerate summary." };
  }
}

// ─── regenerateEmbeddings ──────────────────────────────────────────────────────

export async function regenerateEmbeddings(): Promise<ActionResult> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: {
      name: true, role: true, organization: true,
      skills: true, interests: true, projects: true,
      goals: true, lookingFor: true, aiSummary: true,
    },
  });

  if (!profile?.name || !profile?.role) return { success: false, error: "Profile incomplete." };

  try {
    const embedding = await generateProfileEmbedding({
      name: profile.name,
      role: profile.role,
      organization: profile.organization,
      skills: profile.skills,
      interests: profile.interests,
      projects: profile.projects,
      goals: profile.goals,
      lookingFor: profile.lookingFor,
      aiSummary: profile.aiSummary,
    });

    await db.profile.update({
      where: { userId: user.id },
      data: { embedding },
    });

    return { success: true };
  } catch (err) {
    console.error("[regenerateEmbeddings]", err);
    return { success: false, error: "Failed to regenerate embeddings." };
  }
}

// ─── refreshRecommendations ────────────────────────────────────────────────────

export async function refreshRecommendations(): Promise<ActionResult> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  try {
    await generateRecommendations(user.id);
    revalidatePath("/dashboard/discover");
    revalidatePath("/dashboard/matches");
    return { success: true };
  } catch (err) {
    console.error("[refreshRecommendations]", err);
    return { success: false, error: "Failed to refresh recommendations." };
  }
}

// ─── generateProfileInsights ──────────────────────────────────────────────────

import { chatCompletion } from "@/lib/ai/mistral";

export async function generateProfileInsights(): Promise<ActionResult & { insights?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    select: {
      name: true, role: true, skills: true, interests: true,
      goals: true, lookingFor: true, aiSummary: true,
    },
  });

  if (!profile) return { success: false, error: "Profile not found." };

  const prompt = `You are analyzing a professional profile for a networking platform. 
Give 2 brief, specific insights (1 sentence each) about this person's profile strengths and who they might attract.

Profile:
- Role: ${profile.role ?? "not specified"}
- Skills: ${profile.skills.join(", ") || "none"}
- Interests: ${profile.interests.join(", ") || "none"}
- Goals: ${profile.goals.join(", ") || "none"}
- Looking for: ${profile.lookingFor.join(", ") || "none"}
- Summary: ${profile.aiSummary ?? "not generated"}

Format: Return exactly 2 bullet points (using •). Be specific, not generic. No preamble.`;

  try {
    const insights = await chatCompletion(
      [{ role: "user", content: prompt }],
      "mistral-small-latest"
    );
    return { success: true, insights: insights.trim() };
  } catch (err) {
    console.error("[generateProfileInsights]", err);
    return { success: false, error: "Failed to generate insights." };
  }
}
