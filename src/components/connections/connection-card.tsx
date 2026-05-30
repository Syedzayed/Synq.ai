"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { ConnectButton } from "./connect-button";
import { MessageButton } from "@/components/messages/message-button";
import type { ConnectionRequest } from "@/actions/connections";

const EASE = [0.22, 1, 0.36, 1] as const;

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  return gradients[(name?.charCodeAt(0) ?? 65) % gradients.length];
}

interface ConnectionCardProps {
  connection: ConnectionRequest;
  currentUserId: string;
  index?: number;
}

export function ConnectionCard({ connection, currentUserId, index = 0 }: ConnectionCardProps) {
  const { id, status, senderId, otherUser } = connection;
  const name = otherUser.name ?? "Anonymous";
  const isSender = senderId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: EASE }}
      className="flex items-center gap-4 p-4 rounded-2xl transition-colors"
      style={{
        background: "rgba(255,252,248,0.98)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow: "0 1px 8px rgba(58,53,48,0.04)",
      }}
    >
      {/* Avatar */}
      <div
        className="h-11 w-11 rounded-2xl flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
        style={{ background: avatarGradient(name) }}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: "#1e1a17" }}>
          {name}
        </p>
        {otherUser.role && (
          <p className="text-[12px] flex items-center gap-1 mt-0.5 truncate" style={{ color: "#9e9890" }}>
            <Briefcase size={10} />
            {otherUser.role}
            {otherUser.organization && ` · ${otherUser.organization}`}
          </p>
        )}
        {otherUser.aiSummary && (
          <p className="text-[12px] mt-1 line-clamp-1" style={{ color: "#6b6560" }}>
            {otherUser.aiSummary}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ConnectButton
          targetUserId={otherUser.userId}
          initialStatus={status}
          connectionId={id}
          isSender={isSender}
          size="sm"
        />
        {status === "ACCEPTED" && (
          <MessageButton targetUserId={otherUser.userId} size="sm" variant="outline" />
        )}
        <Link
          href={`/dashboard/discover/${otherUser.userId}`}
          className="p-2 rounded-xl transition-colors hover:bg-[rgba(232,226,216,0.5)]"
          title="View Profile"
        >
          <ArrowRight size={14} style={{ color: "#9e9890" }} />
        </Link>
      </div>
    </motion.div>
  );
}
