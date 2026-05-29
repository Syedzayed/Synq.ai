"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Send, User, Briefcase, Building2, Zap, Heart, FolderOpen, Target, Users } from "lucide-react";
import { OnboardingData } from "@/actions/onboarding";

interface ProfileReviewProps {
  data: OnboardingData;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

function BentoCard({ icon: Icon, label, items, onEdit }: { icon: React.ElementType; label: string; items: string | string[]; onEdit: () => void }) {
  const list = Array.isArray(items) ? items : [items];
  if (!list.length || (list.length === 1 && !list[0])) return null;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "rgba(255,252,248,0.95)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.10)" }}>
            <Icon size={14} style={{ color: "#e07a5f" }} />
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>{label}</p>
        </div>
        <button type="button" onClick={onEdit} className="text-[11.5px] font-medium transition-colors hover:underline" style={{ color: "#e07a5f" }}>Edit</button>
      </div>
      {Array.isArray(items) ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span key={item} className="px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: "#f8f4ef", color: "#3a3530", border: "1px solid rgba(232,226,216,0.9)" }}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[13.5px] leading-relaxed" style={{ color: "#3a3530" }}>{items}</p>
      )}
    </motion.div>
  );
}

export function ProfileReview({ data, onSubmit, onBack, isLoading }: ProfileReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#e07a5f" }}>Almost there</p>
        <h2 style={{ fontFamily: "Instrument Serif, ui-serif, Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "#1e1a17", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Your profile looks great.
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: "#9e9890" }}>
          Review your profile below. Click any card to edit.
        </p>
      </div>

      {/* Identity hero card */}
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(224,122,95,0.08) 0%, rgba(244,162,97,0.05) 100%)", border: "1px solid rgba(224,122,95,0.2)" }}>
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}>
          {data.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[17px] font-semibold" style={{ color: "#1e1a17" }}>{data.name}</p>
          <p className="text-[14px]" style={{ color: "#6b6560" }}>
            {data.role}{data.organization ? ` · ${data.organization}` : ""}
          </p>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BentoCard icon={Zap} label="Skills" items={data.skills} onEdit={onBack} />
        <BentoCard icon={Heart} label="Interests" items={data.interests} onEdit={onBack} />
        <BentoCard icon={Target} label="Goals" items={data.goals} onEdit={onBack} />
        <BentoCard icon={Users} label="Looking For" items={data.lookingFor} onEdit={onBack} />
        {data.projects && (
          <div className="sm:col-span-2">
            <BentoCard icon={FolderOpen} label="Current Project" items={data.projects} onEdit={onBack} />
          </div>
        )}
      </div>

      {/* AI notice */}
      <div className="rounded-2xl p-3.5 flex items-start gap-3" style={{ background: "rgba(224,122,95,0.05)", border: "1px solid rgba(224,122,95,0.15)" }}>
        <Zap size={14} style={{ color: "#e07a5f", flexShrink: 0, marginTop: 2 }} />
        <p className="text-[12.5px]" style={{ color: "#9e9890" }}>
          Synq will generate your AI profile summary and semantic embedding after you submit. This powers your matches.
        </p>
      </div>

      <div className="flex gap-3">
        <motion.button type="button" onClick={onBack} disabled={isLoading} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-medium" style={{ background: "#f8f4ef", border: "1.5px solid rgba(232,226,216,0.9)", color: "#9e9890" }}>
          <ChevronLeft size={15} />Back
        </motion.button>
        <motion.button type="button" onClick={onSubmit} disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.015 }} whileTap={{ scale: isLoading ? 1 : 0.985 }} className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white transition-all duration-200" style={{ background: isLoading ? "rgba(224,122,95,0.6)" : "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)", boxShadow: isLoading ? "none" : "0 2px 12px rgba(224,122,95,0.35)" }}>
          {isLoading ? (
            <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Generating your profile…</>
          ) : (
            <><Send size={15} />Complete Profile</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
