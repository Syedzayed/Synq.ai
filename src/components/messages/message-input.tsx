"use client";

import { useState, useRef, useTransition } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { sendMessage } from "@/actions/messages";
import type { MessageItem } from "@/actions/messages";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: (msg: MessageItem) => void;
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !isPending;

  const handleSend = () => {
    if (!canSend) return;
    setError(null);
    const content = value.trim();
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    startTransition(async () => {
      const result = await sendMessage(conversationId, content);
      if (result.success && result.message) {
        onMessageSent(result.message);
      } else {
        setError(result.error ?? "Failed to send.");
        setValue(content); // restore on error
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div
      className="flex-shrink-0 px-4 py-3"
      style={{ borderTop: "1px solid rgba(232,226,216,0.8)", background: "#fdfbf7" }}
    >
      {error && (
        <p className="text-[11.5px] mb-2 px-1" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
      <div
        className="flex items-end gap-2 rounded-2xl px-4 py-2"
        style={{
          background: "rgba(255,252,248,0.98)",
          border: "1.5px solid rgba(232,226,216,0.9)",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(224,122,95,0.35)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,226,216,0.9)")}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          disabled={isPending}
          className="flex-1 resize-none bg-transparent outline-none text-[14px] py-1.5 leading-relaxed"
          style={{ color: "#1e1a17", maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5"
          style={{
            background: canSend
              ? "linear-gradient(135deg,#e07a5f,#d4694f)"
              : "rgba(232,226,216,0.6)",
            boxShadow: canSend ? "0 2px 8px rgba(224,122,95,0.3)" : "none",
          }}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin text-white" />
          ) : (
            <SendHorizonal
              size={14}
              style={{ color: canSend ? "white" : "#c8c2ba" }}
            />
          )}
        </button>
      </div>
      <p className="text-[10.5px] mt-1.5 px-1" style={{ color: "#c8c2ba" }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
