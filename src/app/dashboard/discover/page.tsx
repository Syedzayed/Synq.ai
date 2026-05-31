import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getRecommendations } from "@/lib/match/recommendation-service";
import { searchProfiles, getFilterOptions } from "@/actions/search";
import { DiscoverHub } from "@/components/discover/discover-hub";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Discover — Synq",
  description: "Discover community builders, view compatibility scores, and unlock AI connections.",
};

export default async function DiscoverPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");

  // Fetch all discovery pipelines parallelly in React Server Component
  const [recommendations, everyoneResult, newestResult, filterOptions] = await Promise.all([
    getRecommendations(user.id, 10),
    searchProfiles("", { sortBy: "compatibility" }),
    searchProfiles("", { sortBy: "newest" }),
    getFilterOptions(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page Header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Networking Hub
        </p>
        <h1
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Discover & Connect
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Intelligent AI recommendations, real-time builder search, and recent additions.
        </p>
      </div>

      <DiscoverHub
        initialRecommendations={recommendations}
        initialEveryone={everyoneResult.success ? everyoneResult.results : []}
        initialNewest={newestResult.success ? newestResult.results : []}
        filterOptions={filterOptions}
      />
    </div>
  );
}
