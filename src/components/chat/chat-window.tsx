"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { STARTER_PROMPTS } from "@/lib/ai/prompts";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface ChatWindowProps {
  messages: DisplayMessage[];
  streamingContent: string;
  isStreaming: boolean;
  onStarterClick: (prompt: string) => void;
}

export function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  onStarterClick,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {isEmpty ? (
        /* Empty state — starter prompts */
        <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
          {/* Orb */}
          <div className="relative">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl blur-xl opacity-40"
              style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div>
            <h2
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                color: "#1e1a17",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Synq AI
            </h2>
            <p className="mt-1.5 text-[13.5px]" style={{ color: "#9e9890" }}>
              Your intelligent networking assistant. Ask me anything.
            </p>
          </div>

          {/* Starter prompts */}
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {STARTER_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt}
                onClick={() => onStarterClick(prompt)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="text-left px-4 py-3 rounded-2xl text-[13px] font-medium transition-all"
                style={{
                  background: "rgba(255,252,248,0.98)",
                  border: "1px solid rgba(232,226,216,0.9)",
                  color: "#3a3530",
                  boxShadow: "0 2px 8px rgba(58,53,48,0.04)",
                }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.createdAt}
              />
            ))}
          </AnimatePresence>

          {/* Streaming message */}
          {isStreaming && streamingContent && (
            <MessageBubble
              key="streaming"
              role="assistant"
              content={streamingContent}
              isStreaming
            />
          )}

          {/* Typing indicator (before first token arrives) */}
          {isStreaming && !streamingContent && <TypingIndicator />}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
