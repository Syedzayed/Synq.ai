import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { DiscoverGrid } from "@/components/discover/discover-grid";

export const metadata: Metadata = {
  title: "Discover — Synq",
  description: "Explore builders, researchers, creators and ambitious teams on Synq.",
};

export default async function DiscoverPage() {
  const user = await getServerUser();

  // Fetch all completed profiles except the current user's
  const profiles = await db.profile.findMany({
    where: {
      userId: { not: user!.id },
      completedAt: { not: null },
    },
    select: {
      userId: true,
      name: true,
      role: true,
      organization: true,
      aiSummary: true,
      skills: true,
      interests: true,
    },
    orderBy: { completedAt: "desc" },
  });

  // Map userId as the card's id (for profile detail route)
  const mapped = profiles.map((p) => ({
    id: p.userId,
    name: p.name ?? "Anonymous",
    role: p.role,
    organization: p.organization,
    aiSummary: p.aiSummary,
    skills: p.skills,
    interests: p.interests,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Discover
        </p>
        <h1
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Discover People
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Explore builders, researchers, creators and ambitious teams.
        </p>

        {/* Count badge */}
        {mapped.length > 0 && (
          <div
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
            style={{
              background: "rgba(224,122,95,0.08)",
              color: "#e07a5f",
              border: "1px solid rgba(224,122,95,0.2)",
            }}
          >
            {mapped.length} {mapped.length === 1 ? "profile" : "profiles"} available
          </div>
        )}
      </div>

      <DiscoverGrid profiles={mapped} />
    </div>
  );
}
