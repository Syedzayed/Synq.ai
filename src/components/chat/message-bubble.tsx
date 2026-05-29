"use client";

import { motion } from "framer-motion";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Minimal markdown: bold, line breaks
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function MessageBubble({
  role,
  content,
  isStreaming = false,
  timestamp,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-2 px-4 py-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mb-1"
        style={{
          background: isUser
            ? "linear-gradient(135deg,#3a3530,#6b6560)"
            : "linear-gradient(135deg,#e07a5f,#f4a261)",
        }}
      >
        {isUser ? "Y" : "S"}
      </div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className="px-4 py-3 rounded-2xl text-[14px] leading-relaxed"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg,#e07a5f 0%,#d4694f 100%)",
                  color: "white",
                  borderBottomRightRadius: "4px",
                  boxShadow: "0 2px 10px rgba(224,122,95,0.3)",
                }
              : {
                  background: "rgba(255,252,248,0.98)",
                  color: "#1e1a17",
                  border: "1px solid rgba(232,226,216,0.9)",
                  borderBottomLeftRadius: "4px",
                  boxShadow: "0 2px 8px rgba(58,53,48,0.06)",
                }
          }
        >
          {renderContent(content)}
          {isStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 ml-0.5 align-middle rounded-full"
              style={{ background: "#e07a5f" }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="text-[11px] px-1" style={{ color: "#c8c2ba" }}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
