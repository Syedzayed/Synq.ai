"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Database, CheckCircle } from "lucide-react";

const STAGES = [
  { icon: Database, label: "Saving your profile…" },
  { icon: Brain, label: "Generating AI summary…" },
  { icon: Sparkles, label: "Creating your embedding…" },
  { icon: CheckCircle, label: "Almost ready!" },
];

interface StepGeneratingProps {
  currentStage: number; // 0-3
}

export function StepGenerating({ currentStage }: StepGeneratingProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Animated orb */}
      <div className="relative h-24 w-24">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
          animate={{ scale: [1.2, 1.5, 1.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={32} color="white" />
        </div>
      </div>

      <div className="text-center">
        <h2
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Building your profile
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: "#9e9890" }}>
          Synq AI is processing your information…
        </p>
      </div>

      {/* Stage progress */}
      <div className="w-full flex flex-col gap-3 max-w-xs">
        {STAGES.map(({ icon: Icon, label }, i) => {
          const isDone = i < currentStage;
          const isCurrent = i === currentStage;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isDone || isCurrent ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{
                  background: isDone
                    ? "linear-gradient(135deg, #e07a5f, #f4a261)"
                    : isCurrent
                    ? "rgba(224,122,95,0.15)"
                    : "#f8f4ef",
                  border: isCurrent
                    ? "1.5px solid rgba(224,122,95,0.4)"
                    : "1.5px solid rgba(232,226,216,0.9)",
                }}
              >
                {isDone ? (
                  <CheckCircle size={14} color="white" />
                ) : (
                  <Icon
                    size={14}
                    style={{ color: isCurrent ? "#e07a5f" : "#c8c2ba" }}
                  />
                )}
              </div>
              <p
                className="text-[13.5px] font-medium transition-colors duration-300"
                style={{ color: isDone ? "#1e1a17" : isCurrent ? "#e07a5f" : "#c8c2ba" }}
              >
                {label}
              </p>
              {isCurrent && (
                <motion.div
                  className="ml-auto flex gap-0.5"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "#e07a5f" }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
