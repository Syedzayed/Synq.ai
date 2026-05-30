"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { ConnectionCard } from "./connection-card";
import type { ConnectionRequest } from "@/actions/connections";

const EASE = [0.22, 1, 0.36, 1] as const;

interface IncomingRequestsProps {
  requests: ConnectionRequest[];
  currentUserId: string;
}

export function IncomingRequests({ requests, currentUserId }: IncomingRequestsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(224,122,95,0.10)" }}
        >
          <Mail size={13} style={{ color: "#e07a5f" }} />
        </div>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          Incoming Requests
        </h2>
        {requests.length > 0 && (
          <span
            className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(224,122,95,0.12)", color: "#e07a5f", border: "1px solid rgba(224,122,95,0.2)" }}
          >
            {requests.length}
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "rgba(255,252,248,0.6)", border: "1.5px dashed rgba(232,226,216,0.8)" }}
        >
          <p className="text-[13.5px]" style={{ color: "#9e9890" }}>
            No pending requests.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((req, i) => (
            <ConnectionCard
              key={req.id}
              connection={req}
              currentUserId={currentUserId}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
