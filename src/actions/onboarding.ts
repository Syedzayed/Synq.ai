"use server";

/**
 * Onboarding Server Action
 *
 * Orchestrates the full onboarding completion pipeline:
 * 1. Validate user session
 * 2. Upsert profile data in the database
 * 3. Generate AI profile summary (Mistral)
 * 4. Generate embedding vector (Mistral)
 * 5. Persist summary + embedding + completedAt
 */
import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db/prisma";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { generateProfileSummary } from "@/lib/ai/summarizer";
import { generateProfileEmbedding } from "@/lib/ai/embeddings";
import { createNotification } from "./notifications";
import { devLog, PerfTimer } from "@/lib/security/logger";

export interface OnboardingData {
  name: string;
  role: string;
  organization: string;
  skills: string[];
  interests: string[];
  projects: string;
  goals: string[];
  lookingFor: string[];
  gender?: string;
}

export interface OnboardingResult {
  success: boolean;
  aiSummary?: string;
  error?: string;
}

export async function completeOnboarding(
  data: OnboardingData
): Promise<OnboardingResult> {
  const timer = new PerfTimer();
  // ── 1. Auth guard ─────────────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  // ── 2. Input validation ───────────────────────────────────────────────────
  if (!data.name?.trim() || !data.role?.trim()) {
    return { success: false, error: "Name and role are required." };
  }
  if (data.skills.length === 0) {
    return { success: false, error: "Please add at least one skill." };
  }

  // ── Self-healing database check: ensure the User row exists first ─────────
  const userExists = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!userExists) {
    console.log(`[completeOnboarding] Self-healing sync: User row missing for ${user.id}. Creating row.`);
    await db.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: data.name.trim(),
      },
    });
  }

  // ── 3. Upsert base profile (before AI calls, to save data immediately) ────
  await db.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      name: data.name.trim(),
      role: data.role.trim(),
      organization: data.organization.trim() || null,
      skills: data.skills,
      interests: data.interests,
      projects: data.projects.trim() || null,
      goals: data.goals,
      lookingFor: data.lookingFor,
      gender: data.gender || null,
      embedding: [],
    },
    update: {
      name: data.name.trim(),
      role: data.role.trim(),
      organization: data.organization.trim() || null,
      skills: data.skills,
      interests: data.interests,
      projects: data.projects.trim() || null,
      goals: data.goals,
      lookingFor: data.lookingFor,
      gender: data.gender || null,
    },
  });

  // ── 4. Generate AI summary ────────────────────────────────────────────────
  let aiSummary: string | null = null;
  try {
    aiSummary = await generateProfileSummary({
      name: data.name,
      role: data.role,
      organization: data.organization || null,
      skills: data.skills,
      interests: data.interests,
      projects: data.projects || null,
      goals: data.goals,
      lookingFor: data.lookingFor,
    });
  } catch (err) {
    console.error("[completeOnboarding] Summary generation failed:", err);
    // Non-fatal — continue without summary
  }

  // ── 5. Generate embedding vector ─────────────────────────────────────────
  let embedding: number[] = [];
  try {
    embedding = await generateProfileEmbedding({
      name: data.name,
      role: data.role,
      organization: data.organization || null,
      skills: data.skills,
      interests: data.interests,
      projects: data.projects || null,
      goals: data.goals,
      lookingFor: data.lookingFor,
      aiSummary,
    });
  } catch (err) {
    console.error("[completeOnboarding] Embedding generation failed:", err);
    // Non-fatal — continue without embedding
  }

  // ── 6. Persist summary, embedding, and mark as complete ──────────────────
  await db.profile.update({
    where: { userId: user.id },
    data: {
      aiSummary,
      embedding,
      completedAt: new Date(),
    },
  });

  // Also sync the name to the User row
  await db.user.update({
    where: { id: user.id },
    data: { name: data.name.trim() },
  });

  // Welcome notification
  await createNotification({
    userId: user.id,
    type: "SYSTEM",
    title: "Welcome to Synq!",
    message: "Your profile is live. Explore your AI-powered matches and start connecting.",
  });

  const elapsed = timer.stop();
  devLog("ONBOARDING", "Onboarding completed successfully.", {
    userId: user.id,
    hasSummary: !!aiSummary,
    hasEmbedding: embedding.length > 0,
  }, elapsed);

  return { success: true, aiSummary: aiSummary ?? undefined };
}
