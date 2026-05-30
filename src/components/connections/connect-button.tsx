"use client";

/**
 * ConnectButton — manages the full connection state lifecycle.
 * Renders the correct action based on current relationship status.
 * Optimistically updates UI on click.
 */

import { useState, useTransition } from "react";
import { UserPlus, Clock, CheckCircle2, Loader2 } from "lucide-react";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  type ConnectionStatus,
} from "@/actions/connections";

interface ConnectButtonProps {
  targetUserId: string;
  initialStatus: ConnectionStatus | null;
  connectionId?: string | null;
  isSender?: boolean;
  size?: "sm" | "md";
}

export function ConnectButton({
  targetUserId,
  initialStatus,
  connectionId,
  isSender = true,
  size = "md",
}: ConnectButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus | null>(initialStatus);
  const [connId, setConnId] = useState<string | null>(connectionId ?? null);
  const [isPending, startTransition] = useTransition();

  const sm = size === "sm";
  const base = `inline-flex items-center gap-1.5 font-semibold transition-all duration-200 rounded-2xl ${
    sm ? "px-3 py-2 text-[12.5px]" : "px-4 py-2.5 text-[13.5px]"
  }`;

  const handleSend = () => {
    startTransition(async () => {
      const res = await sendConnectionRequest(targetUserId);
      if (res.success) setStatus("PENDING");
    });
  };

  const handleAccept = () => {
    if (!connId) return;
    startTransition(async () => {
      const res = await acceptConnectionRequest(connId);
      if (res.success) setStatus("ACCEPTED");
    });
  };

  const handleReject = () => {
    if (!connId) return;
    startTransition(async () => {
      const res = await rejectConnectionRequest(connId);
      if (res.success) setStatus("REJECTED");
    });
  };

  // ── ACCEPTED ──────────────────────────────────────────────────────────────
  if (status === "ACCEPTED") {
    return (
      <span
        className={`${base} cursor-default`}
        style={{ background: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }}
      >
        <CheckCircle2 size={sm ? 13 : 15} />
        Connected
      </span>
    );
  }

  // ── PENDING (I sent it) ────────────────────────────────────────────────────
  if (status === "PENDING" && isSender) {
    return (
      <span
        className={`${base} cursor-default`}
        style={{ background: "rgba(244,162,97,0.10)", color: "#c47f30", border: "1px solid rgba(244,162,97,0.25)" }}
      >
        <Clock size={sm ? 12 : 14} />
        Pending
      </span>
    );
  }

  // ── PENDING (they sent to me — show accept/decline) ───────────────────────
  if (status === "PENDING" && !isSender) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isPending}
          className={`${base}`}
          style={{ background: "linear-gradient(135deg,#e07a5f,#d4694f)", color: "white", boxShadow: "0 2px 8px rgba(224,122,95,0.25)" }}
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Accept
        </button>
        <button
          onClick={handleReject}
          disabled={isPending}
          className={`${base}`}
          style={{ background: "#f8f4ef", color: "#9e9890", border: "1px solid rgba(232,226,216,0.9)" }}
        >
          Decline
        </button>
      </div>
    );
  }

  // ── REJECTED or NULL — show Connect ──────────────────────────────────────
  return (
    <button
      onClick={handleSend}
      disabled={isPending}
      className={`${base} hover:shadow-md`}
      style={{
        background: "#f8f4ef",
        color: "#3a3530",
        border: "1px solid rgba(232,226,216,0.9)",
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {isPending ? (
        <Loader2 size={sm ? 12 : 14} className="animate-spin" />
      ) : (
        <UserPlus size={sm ? 12 : 14} />
      )}
      Connect
    </button>
  );
}
