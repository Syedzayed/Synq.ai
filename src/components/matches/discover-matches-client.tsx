"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RecommendedGrid } from "@/components/matches/recommended-grid";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";

interface DiscoverMatchesClientProps {
  initialRecommendations: StoredRecommendation[];
}

export function DiscoverMatchesClient({ initialRecommendations }: DiscoverMatchesClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRegenerate = () => {
    startTransition(async () => {
      try {
        await fetch("/api/matches/generate", { method: "POST" });
        router.refresh();
      } catch (err) {
        console.error("Failed to generate recommendations", err);
      }
    });
  };

  return (
    <RecommendedGrid
      recommendations={recommendations}
      onRegenerate={handleRegenerate}
      isRegenerating={isPending}
    />
  );
}
