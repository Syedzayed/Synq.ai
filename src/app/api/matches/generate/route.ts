/**
 * POST /api/matches/generate
 *
 * Triggers recommendation generation for the current user.
 * Called on first visit or when the user explicitly refreshes.
 */

import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth/supabase-server";
import { generateRecommendations } from "@/lib/match/recommendation-service";

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await generateRecommendations(user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[matches/generate]", err);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
