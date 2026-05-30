import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getRecommendations } from "@/lib/match/recommendation-service";
import { DiscoverMatchesClient } from "@/components/matches/discover-matches-client";

export const metadata: Metadata = {
  title: "Matches — Synq",
  description: "Your full AI-powered match list on Synq.",
};

export default async function MatchesPage() {
  const user = await getServerUser();
  const recommendations = await getRecommendations(user!.id, 10);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          AI Matchmaking
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
          Your Matches
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Powered by Mistral AI — scored across skills, interests, goals &amp; embeddings.
        </p>
      </div>

      <DiscoverMatchesClient initialRecommendations={recommendations} />
    </div>
  );
}
