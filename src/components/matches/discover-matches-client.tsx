"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RecommendedGrid } from "@/components/matches/recommended-grid";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";
import type { ConnectionStatus } from "@/actions/connections";

export type ConnectionMapEntry = {
  status: ConnectionStatus;
  connectionId: string;
  isSender: boolean;
};

interface DiscoverMatchesClientProps {
  initialRecommendations: StoredRecommendation[];
  connectionMap?: Record<string, ConnectionMapEntry>;
}

export function DiscoverMatchesClient({
  initialRecommendations,
  connectionMap = {},
}: DiscoverMatchesClientProps) {
  const [recommendations] = useState(initialRecommendations);
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
      connectionMap={connectionMap}
      onRegenerate={handleRegenerate}
      isRegenerating={isPending}
    />
  );
}
