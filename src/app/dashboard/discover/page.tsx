import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getRecommendations } from "@/lib/match/recommendation-service";
import { db } from "@/lib/db/prisma";
import { DiscoverMatchesClient } from "@/components/matches/discover-matches-client";

export const metadata: Metadata = {
  title: "Discover — Synq",
  description: "Your AI-powered recommended connections on Synq.",
};

export default async function DiscoverPage() {
  const user = await getServerUser();

  // Fetch recommendations + all connections for this user in parallel
  const [recommendations, connections] = await Promise.all([
    getRecommendations(user!.id, 10),
    db.connection.findMany({
      where: {
        OR: [{ senderId: user!.id }, { receiverId: user!.id }],
      },
      select: { senderId: true, receiverId: true, status: true, id: true },
    }),
  ]);

  // Build a lookup: otherUserId → { status, connectionId, isSender }
  const connectionMap: Record<
    string,
    { status: "PENDING" | "ACCEPTED" | "REJECTED"; connectionId: string; isSender: boolean }
  > = {};

  for (const c of connections) {
    const isMe = c.senderId === user!.id;
    const otherId = isMe ? c.receiverId : c.senderId;
    connectionMap[otherId] = {
      status: c.status as "PENDING" | "ACCEPTED" | "REJECTED",
      connectionId: c.id,
      isSender: isMe,
    };
  }

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
          Recommended Connections
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Intelligent matches powered by AI — ranked by compatibility.
        </p>
      </div>

      <DiscoverMatchesClient
        initialRecommendations={recommendations}
        connectionMap={connectionMap}
      />
    </div>
  );
}
