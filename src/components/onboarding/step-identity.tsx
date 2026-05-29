"use client";

import { motion } from "framer-motion";
import { User, Briefcase, Building2, ChevronRight } from "lucide-react";
import { OnboardingData } from "@/actions/onboarding";

const EASE = [0.22, 1, 0.36, 1] as const;

const ROLE_PRESETS = [
  "Software Engineer",
  "Designer",
  "Product Manager",
  "Researcher",
  "Student",
  "Founder",
  "Data Scientist",
  "Marketing",
  "DevOps Engineer",
  "Consultant",
];

interface StepIdentityProps {
  data: Pick<OnboardingData, "name" | "role" | "organization">;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
}

function InputField({
  label,
  id,
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  id: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: "#3a3530" }}
      >
        <Icon size={13} style={{ color: "#e07a5f" }} />
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
        style={{
          background: "#f8f4ef",
          border: "1.5px solid rgba(232,226,216,0.9)",
          color: "#1e1a17",
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
    </div>
  );
}

export function StepIdentity({ data, onChange, onNext }: StepIdentityProps) {
  const canProceed = data.name.trim().length >= 2 && data.role.trim().length >= 2;

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Let's start with you
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
          Who are you?
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: "#9e9890" }}>
          This is how you'll appear to people in your network.
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <InputField
          label="Full Name"
          id="identity-name"
          icon={User}
          value={data.name}
          onChange={(v) => onChange({ name: v })}
          placeholder="Your full name"
          autoComplete="name"
        />

        <div className="flex flex-col gap-1.5">
          <label
            className="flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: "#3a3530" }}
          >
            <Briefcase size={13} style={{ color: "#e07a5f" }} />
            Role / Title
          </label>

          {/* Role quick-select */}
          <div className="flex flex-wrap gap-2 mb-2">
            {ROLE_PRESETS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onChange({ role })}
                className="px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
                style={
                  data.role === role
                    ? {
                        background:
                          "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
                        color: "white",
                        border: "1.5px solid transparent",
                        boxShadow: "0 2px 8px rgba(224,122,95,0.3)",
                      }
                    : {
                        background: "#f8f4ef",
                        color: "#3a3530",
                        border: "1.5px solid rgba(232,226,216,0.9)",
                      }
                }
              >
                {role}
              </button>
            ))}
          </div>

          <input
            id="identity-role"
            type="text"
            value={data.role}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="Or type your role..."
            className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
            style={{
              background: "#f8f4ef",
              border: "1.5px solid rgba(232,226,216,0.9)",
              color: "#1e1a17",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border =
                "1.5px solid rgba(224,122,95,0.6)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(224,122,95,0.08)";
              e.currentTarget.style.background = "#fdfbf7";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border =
                "1.5px solid rgba(232,226,216,0.9)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "#f8f4ef";
            }}
          />
        </div>

        <InputField
          label="University or Company"
          id="identity-org"
          icon={Building2}
          value={data.organization}
          onChange={(v) => onChange({ organization: v })}
          placeholder="Where are you based? (optional)"
        />
      </div>

      {/* Next */}
      <motion.button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        whileHover={{ scale: canProceed ? 1.015 : 1 }}
        whileTap={{ scale: canProceed ? 0.985 : 1 }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white transition-all duration-200"
        style={{
          background: canProceed
            ? "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)"
            : "rgba(232,226,216,0.9)",
          color: canProceed ? "white" : "#b8b2aa",
          boxShadow: canProceed
            ? "0 2px 12px rgba(224,122,95,0.35)"
            : "none",
        }}
      >
        Continue
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}
