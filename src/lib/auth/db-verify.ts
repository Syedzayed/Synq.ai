/**
 * Database verification utilities.
 * Server-only helpers to check user, profile, and session state.
 */
import "server-only";
import { db } from "@/lib/db/prisma";

// ─── User checks ───────────────────────────────────────────────────────────────

/**
 * Returns the Prisma user record for the given Supabase UUID, or null.
 */
export async function getUserById(supabaseId: string) {
  try {
    return await db.user.findUnique({ where: { id: supabaseId } });
  } catch (err) {
    console.error("[getUserById]", err);
    return null;
  }
}

/**
 * Returns the user record by email, or null.
 */
export async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (err) {
    console.error("[getUserByEmail]", err);
    return null;
  }
}

// ─── Profile checks ────────────────────────────────────────────────────────────

/**
 * Returns the profile record for the given userId, or null.
 */
export async function getProfileByUserId(userId: string) {
  try {
    return await db.profile.findUnique({ where: { userId } });
  } catch (err) {
    console.error("[getProfileByUserId]", err);
    return null;
  }
}

/**
 * Returns true if a profile record exists for the given userId.
 */
export async function profileExists(userId: string): Promise<boolean> {
  const count = await db.profile.count({ where: { userId } }).catch(() => 0);
  return count > 0;
}

// ─── User + Profile creation ───────────────────────────────────────────────────

interface EnsureUserProfileOptions {
  supabaseId: string;
  email: string;
  name?: string | null;
}

/**
 * Ensures a Prisma `User` and an empty `Profile` record exist for the given
 * Supabase user. Safe to call multiple times — uses upsert semantics to
 * handle race conditions.
 *
 * Call this after a successful Supabase `signUp`.
 */
export async function ensureUserProfile({
  supabaseId,
  email,
  name,
}: EnsureUserProfileOptions): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[ensureUserProfile] syncing user ${supabaseId} (${email})`);
  }

  // 1. Upsert the User row
  const user = await db.user.upsert({
    where: { id: supabaseId },
    create: { id: supabaseId, email, name: name ?? null },
    update: { email, name: name ?? null },
  });

  // 2. Create a skeleton Profile only if one doesn't already exist
  const exists = await profileExists(user.id);
  if (!exists) {
    await db.profile.create({
      data: {
        userId: user.id,
        goals: [],
        skills: [],
        embedding: [],
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`[ensureUserProfile] created profile for ${user.id}`);
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[ensureUserProfile] profile already exists for ${user.id}`);
    }
  }
}
