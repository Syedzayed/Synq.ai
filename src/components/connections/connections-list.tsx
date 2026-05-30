"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { ConnectionCard } from "./connection-card";
import type { ConnectionRequest } from "@/actions/connections";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ConnectionsListProps {
  connections: ConnectionRequest[];
  currentUserId: string;
}

export function ConnectionsList({ connections, currentUserId }: ConnectionsListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.10)" }}
        >
          <Network size={13} style={{ color: "#16a34a" }} />
        </div>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          My Connections
        </h2>
        {connections.length > 0 && (
          <span
            className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            {connections.length}
          </span>
        )}
      </div>

      {connections.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center flex flex-col items-center gap-3"
          style={{ background: "rgba(255,252,248,0.6)", border: "1.5px dashed rgba(232,226,216,0.8)" }}
        >
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.08)" }}
          >
            <Network size={20} style={{ color: "#16a34a" }} />
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "#1e1a17" }}>
              Your network starts with one connection.
            </p>
            <p className="text-[12.5px] mt-1" style={{ color: "#9e9890" }}>
              Visit Discover to find and connect with people.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {connections.map((conn, i) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              currentUserId={currentUserId}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
