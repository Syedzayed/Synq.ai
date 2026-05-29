"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingData } from "@/actions/onboarding";
import { TagSelector } from "./tag-selector";

const GOAL_PRESETS = [
  "Find cofounders", "Join a startup", "Meet researchers",
  "Build a product", "Find collaborators", "Get hired",
  "Hire talent", "Learn new skills", "Find a mentor",
  "Become a mentor", "Raise funding", "Network globally",
  "Find freelance work", "Launch a project", "Academic collaboration",
];

interface StepGoalsProps {
  data: Pick<OnboardingData, "goals">;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepGoals({ data, onChange, onNext, onBack }: StepGoalsProps) {
  const canProceed = data.goals.length > 0;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#e07a5f" }}>
          Your ambitions
        </p>
        <h2 style={{ fontFamily: "Instrument Serif, ui-serif, Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "#1e1a17", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          What are you hoping to achieve?
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: "#9e9890" }}>
          Pick what resonates right now.{data.goals.length > 0 && <span className="ml-1 font-semibold" style={{ color: "#e07a5f" }}>{data.goals.length} selected</span>}
        </p>
      </div>
      <TagSelector presets={GOAL_PRESETS} selected={data.goals} onChange={(goals) => onChange({ goals })} placeholder="Add a goal..." />
      <div className="flex gap-3 mt-2">
        <motion.button type="button" onClick={onBack} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-medium" style={{ background: "#f8f4ef", border: "1.5px solid rgba(232,226,216,0.9)", color: "#9e9890" }}>
          <ChevronLeft size={15} />Back
        </motion.button>
        <motion.button type="button" onClick={onNext} disabled={!canProceed} whileHover={{ scale: canProceed ? 1.015 : 1 }} whileTap={{ scale: canProceed ? 0.985 : 1 }} className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-[14.5px] font-semibold transition-all duration-200" style={{ background: canProceed ? "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)" : "rgba(232,226,216,0.9)", color: canProceed ? "white" : "#b8b2aa", boxShadow: canProceed ? "0 2px 12px rgba(224,122,95,0.35)" : "none" }}>
          Continue<ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
