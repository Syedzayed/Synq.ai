"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { createConversation } from "@/actions/messages";

interface MessageButtonProps {
  targetUserId: string;
  size?: "sm" | "md";
  variant?: "outline" | "solid";
}

export function MessageButton({
  targetUserId,
  size = "md",
  variant = "outline",
}: MessageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const sm = size === "sm";

  const handleClick = () => {
    startTransition(async () => {
      const result = await createConversation(targetUserId);
      if (result.success && result.conversationId) {
        router.push(`/dashboard/messages/${result.conversationId}`);
      }
    });
  };

  const base = `inline-flex items-center gap-1.5 font-semibold rounded-2xl transition-all duration-200 ${
    sm ? "px-3 py-2 text-[12.5px]" : "px-4 py-2.5 text-[13.5px]"
  }`;

  const solid = {
    background: "linear-gradient(135deg,#e07a5f,#d4694f)",
    color: "white",
    boxShadow: "0 2px 8px rgba(224,122,95,0.25)",
  };

  const outline = {
    background: "#f8f4ef",
    color: "#3a3530",
    border: "1px solid rgba(232,226,216,0.9)",
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${base} hover:shadow-md`}
      style={{ ...(variant === "solid" ? solid : outline), opacity: isPending ? 0.7 : 1 }}
    >
      {isPending ? (
        <Loader2 size={sm ? 12 : 14} className="animate-spin" />
      ) : (
        <MessageSquare size={sm ? 12 : 14} />
      )}
      Message
    </button>
  );
}
