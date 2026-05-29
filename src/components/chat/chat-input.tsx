"use client";

import { useRef, useEffect, KeyboardEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div
      className="px-4 py-3"
      style={{ borderTop: "1px solid rgba(232,226,216,0.8)" }}
    >
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
        style={{
          background: "#f8f4ef",
          border: "1.5px solid rgba(232,226,216,0.9)",
        }}
        onFocus={() => {}}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Synq AI anything…"
          disabled={disabled || isLoading}
          className="flex-1 bg-transparent outline-none text-[14px] resize-none leading-relaxed"
          style={{ color: "#1e1a17", maxHeight: "160px" }}
        />

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          whileHover={{ scale: canSend ? 1.08 : 1 }}
          whileTap={{ scale: canSend ? 0.92 : 1 }}
          className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: canSend
              ? "linear-gradient(135deg,#e07a5f 0%,#d4694f 100%)"
              : "rgba(232,226,216,0.9)",
            boxShadow: canSend ? "0 2px 8px rgba(224,122,95,0.35)" : "none",
          }}
        >
          {isLoading ? (
            <Loader2 size={14} color="white" className="animate-spin" />
          ) : (
            <Send size={14} color={canSend ? "white" : "#b8b2aa"} />
          )}
        </motion.button>
      </div>
      <p className="text-center text-[11px] mt-2" style={{ color: "#c8c2ba" }}>
        Shift+Enter for new line · Enter to send
      </p>
    </div>
  );
}
