import type { Metadata } from "next";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getUserConnections } from "@/actions/connections";
import { IncomingRequests } from "@/components/connections/incoming-requests";
import { SentRequests } from "@/components/connections/sent-requests";
import { ConnectionsList } from "@/components/connections/connections-list";

export const metadata: Metadata = {
  title: "Connections — Synq",
  description: "Manage your professional connections and requests on Synq.",
};

export default async function ConnectionsPage() {
  const user = await getServerUser();
  const data = await getUserConnections();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page header */}
      <div className="mb-10">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Network
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
          Connections
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Manage your network — requests, pending, and active connections.
        </p>

        {/* Summary pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {data.pendingIncomingCount > 0 && (
            <span
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{
                background: "rgba(224,122,95,0.10)",
                color: "#e07a5f",
                border: "1px solid rgba(224,122,95,0.2)",
              }}
            >
              {data.pendingIncomingCount} incoming{" "}
              {data.pendingIncomingCount === 1 ? "request" : "requests"}
            </span>
          )}
          {data.accepted.length > 0 && (
            <span
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{
                background: "rgba(34,197,94,0.08)",
                color: "#16a34a",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              {data.accepted.length}{" "}
              {data.accepted.length === 1 ? "connection" : "connections"}
            </span>
          )}
        </div>
      </div>

      {/* Three sections */}
      <div className="flex flex-col gap-10">
        <IncomingRequests
          requests={data.incoming}
          currentUserId={user!.id}
        />
        <SentRequests
          requests={data.sent}
          currentUserId={user!.id}
        />
        <ConnectionsList
          connections={data.accepted}
          currentUserId={user!.id}
        />
      </div>
    </div>
  );
}
