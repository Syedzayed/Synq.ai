"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEP_LABELS = [
  "Identity",
  "Gender",
  "Skills",
  "Interests",
  "Projects",
  "Goals",
  "Looking For",
  "Review",
];

interface OnboardingProgressProps {
  currentStep: number; // 1-indexed, 1=Identity ... 7=Review
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div className="w-full flex flex-col items-center gap-3 mb-8">
      {/* Step dots + connector line */}
      <div className="flex items-center gap-0">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={label} className="flex items-center">
              {/* Connector line before (except first) */}
              {i > 0 && (
                <motion.div
                  className="h-px w-8 sm:w-12"
                  style={{
                    background:
                      isDone
                        ? "#e07a5f"
                        : "rgba(232,226,216,0.9)",
                  }}
                  animate={{
                    background: isDone
                      ? "#e07a5f"
                      : "rgba(232,226,216,0.9)",
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Dot */}
              <motion.div
                className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold relative flex-shrink-0"
                animate={{
                  background: isDone
                    ? "#e07a5f"
                    : isCurrent
                    ? "#fdfbf7"
                    : "rgba(232,226,216,0.6)",
                  border: isCurrent
                    ? "2px solid #e07a5f"
                    : isDone
                    ? "2px solid #e07a5f"
                    : "2px solid rgba(232,226,216,0.9)",
                  scale: isCurrent ? 1.15 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {isDone ? (
                  <Check size={12} color="white" strokeWidth={3} />
                ) : (
                  <span
                    style={{
                      color: isCurrent ? "#e07a5f" : "#c8c2ba",
                    }}
                  >
                    {step}
                  </span>
                )}

                {/* Current step pulse ring */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "2px solid rgba(224,122,95,0.3)" }}
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Step label */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: "#e07a5f" }}
      >
        Step {currentStep} of {STEP_LABELS.length} — {STEP_LABELS[currentStep - 1]}
      </motion.p>
    </div>
  );
}
