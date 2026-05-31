"use client";

import { motion } from "framer-motion";
import { User, Users, ShieldAlert, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface StepGenderProps {
  data: { gender?: string };
  onChange: (partial: Partial<{ gender: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GENDER_OPTIONS = [
  { value: "Male", label: "Male", desc: "Identify as male" },
  { value: "Female", label: "Female", desc: "Identify as female" },
  { value: "Non-Binary", label: "Non-Binary", desc: "Identify as non-binary" },
  { value: "Prefer Not To Say", label: "Prefer Not To Say", desc: "Hide or keep private" },
];

export function StepGender({ data, onChange, onNext, onBack }: StepGenderProps) {
  const selected = data.gender || "";

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#e07a5f" }}>
          Step 2 of 8
        </p>
        <h2
          className="mt-1"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            color: "#1e1a17",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Gender Representation
        </h2>
        <p className="text-[14px] mt-2 leading-relaxed" style={{ color: "#6b6560" }}>
          Choose how you represent yourself. If you select "Prefer Not To Say", your gender is fully hidden and kept private.
        </p>
      </div>

      {/* Grid Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GENDER_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange({ gender: opt.value })}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer w-full"
              style={{
                background: isSelected ? "rgba(224,122,95,0.03)" : "white",
                border: isSelected
                  ? "2px solid #e07a5f"
                  : "1px solid rgba(232,226,216,0.9)",
                boxShadow: isSelected ? "0 4px 12px rgba(224,122,95,0.06)" : "0 2px 6px rgba(58,53,48,0.01)",
              }}
            >
              <span
                className="text-[14.5px] font-bold"
                style={{ color: isSelected ? "#e07a5f" : "#1e1a17" }}
              >
                {opt.label}
              </span>
              <span className="text-[12px] mt-1" style={{ color: "#9e9890" }}>
                {opt.desc}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#e8e2d8]/60 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:bg-neutral-50"
          style={{ color: "#6b6560" }}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all"
          style={{
            background: !selected
              ? "rgba(224,122,95,0.5)"
              : "linear-gradient(135deg,#e07a5f,#d4694f)",
            boxShadow: !selected ? "none" : "0 2px 8px rgba(224,122,95,0.2)",
            cursor: !selected ? "not-allowed" : "pointer",
          }}
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
