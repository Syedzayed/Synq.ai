"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingData } from "@/actions/onboarding";

interface StepProjectsProps {
  data: Pick<OnboardingData, "projects">;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EXAMPLES = [
  "An AI tool that helps researchers find related papers",
  "A mobile app for local community events",
  "A SaaS platform for freelance project management",
  "Exploring adversarial robustness in vision models",
];

export function StepProjects({ data, onChange, onNext, onBack }: StepProjectsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Your work
        </p>
        <h2
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          What are you building?
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: "#9e9890" }}>
          Describe what you&apos;re currently working on. This helps the AI understand your context.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          id="projects-input"
          value={data.projects}
          onChange={(e) => onChange({ projects: e.target.value })}
          placeholder="Describe your current project or focus area..."
          rows={4}
          maxLength={500}
          className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none transition-all duration-200 resize-none"
          style={{
            background: "#f8f4ef",
            border: "1.5px solid rgba(232,226,216,0.9)",
            color: "#1e1a17",
            lineHeight: 1.6,
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1.5px solid rgba(224,122,95,0.6)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(224,122,95,0.08)";
            e.currentTarget.style.background = "#fdfbf7";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1.5px solid rgba(232,226,216,0.9)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "#f8f4ef";
          }}
        />
        <div className="flex justify-between">
          <p className="text-[11.5px]" style={{ color: "#b8b2aa" }}>
            Optional, but helps with better matching
          </p>
          <p className="text-[11.5px]" style={{ color: "#b8b2aa" }}>
            {data.projects.length}/500
          </p>
        </div>
      </div>

      {/* Examples */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(224,122,95,0.05)",
          border: "1px solid rgba(224,122,95,0.15)",
        }}
      >
        <p
          className="text-[12px] font-semibold mb-2.5"
          style={{ color: "#e07a5f" }}
        >
          Example answers
        </p>
        <div className="flex flex-col gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onChange({ projects: ex })}
              className="text-left text-[12.5px] leading-relaxed hover:underline transition-colors"
              style={{ color: "#9e9890" }}
            >
              → {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-medium"
          style={{
            background: "#f8f4ef",
            border: "1.5px solid rgba(232,226,216,0.9)",
            color: "#9e9890",
          }}
        >
          <ChevronLeft size={15} />
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-[14.5px] font-semibold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
            boxShadow: "0 2px 12px rgba(224,122,95,0.35)",
          }}
        >
          Continue
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
