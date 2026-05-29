"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      {/* Avatar */}
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
      >
        S
      </div>

      {/* Bubble with dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: "rgba(255,252,248,0.98)",
          border: "1px solid rgba(232,226,216,0.9)",
          boxShadow: "0 2px 8px rgba(58,53,48,0.06)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: "#c8c2ba" }}
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
