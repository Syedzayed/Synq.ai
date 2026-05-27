/**
 * Placeholder server action for user profile operations.
 * Replace the console.log stubs with real DB calls once schema is migrated.
 */

"use server";

import { db } from "@/lib/db/prisma";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { generateEmbedding } from "@/lib/ai/mistral";
import { buildProfileEmbeddingText } from "@/lib/prompts/match";
import type { ApiResponse, ProfileBase } from "@/types";

/**
 * Upsert (create or update) a user's profile and regenerate their embedding.
 */
export async function upsertProfile(
  userId: string,
  input: ProfileInput
): Promise<ApiResponse<ProfileBase>> {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    const embeddingText = buildProfileEmbeddingText(parsed.data);
    const embedding = await generateEmbedding(embeddingText);

    const profile = await db.profile.upsert({
      where: { userId },
      create: { userId, ...parsed.data, embedding },
      update: { ...parsed.data, embedding },
    });

    return { success: true, data: profile };
  } catch (err) {
    console.error("[upsertProfile]", err);
    return { success: false, error: "Failed to save profile." };
  }
}
