"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, Check, RefreshCw, Sparkles } from "lucide-react";
import {
  updateProfile,
  regenerateEmbeddings,
  refreshRecommendations,
  type ProfileUpdateInput,
} from "@/actions/profile-management";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileUpdateInput;
}

// ─── Tag input ─────────────────────────────────────────────────────────────────

function TagInput({
  label,
  value,
  onChange,
  placeholder,
  max = 20,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= max) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
            style={{
              background: "rgba(224,122,95,0.08)",
              color: "#c9604a",
              border: "1px solid rgba(224,122,95,0.18)",
            }}
          >
            {tag}
            <button type="button" onClick={() => remove(tag)}>
              <X size={10} style={{ color: "#e07a5f" }} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          }}
          placeholder={placeholder ?? `Add ${label.toLowerCase()}…`}
          className="flex-1 px-3 py-2 rounded-xl text-[13px] outline-none transition-all"
          style={{
            background: "#f8f4ef",
            border: "1px solid rgba(232,226,216,0.9)",
            color: "#1e1a17",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(224,122,95,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(232,226,216,0.9)")}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-xl transition-colors"
          style={{ background: "rgba(224,122,95,0.10)", color: "#e07a5f" }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Text field ────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const base = {
    background: "#f8f4ef",
    border: "1px solid rgba(232,226,216,0.9)",
    color: "#1e1a17",
    borderRadius: "12px",
    fontSize: "13px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#9e9890" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...base, resize: "vertical" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(224,122,95,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(232,226,216,0.9)")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "rgba(224,122,95,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(232,226,216,0.9)")}
        />
      )}
    </div>
  );
}

// ─── Main form ─────────────────────────────────────────────────────────────────

export function EditProfileForm({ isOpen, onClose, initialData }: EditProfileFormProps) {
  const [form, setForm] = useState<ProfileUpdateInput>(initialData);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"idle" | "saving" | "embedding" | "refreshing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset form when re-opened
  useEffect(() => {
    if (isOpen) { setForm(initialData); setStep("idle"); setError(null); }
  }, [isOpen]); // eslint-disable-line

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const set = <K extends keyof ProfileUpdateInput>(key: K, val: ProfileUpdateInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      // 1. Save profile fields
      setStep("saving");
      const saveResult = await updateProfile(form);
      if (!saveResult.success) { setError(saveResult.error ?? "Save failed."); setStep("idle"); return; }

      // 2. Regenerate embeddings
      setStep("embedding");
      await regenerateEmbeddings();

      // 3. Refresh recommendations
      setStep("refreshing");
      await refreshRecommendations();

      setStep("done");
      setTimeout(() => { onClose(); router.refresh(); }, 800);
    });
  };

  const stepLabel: Record<typeof step, string> = {
    idle:       "Save Changes",
    saving:     "Saving profile…",
    embedding:  "Updating embeddings…",
    refreshing: "Refreshing matches…",
    done:       "Done!",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdrop}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
            style={{ background: "rgba(30,26,23,0.55)", backdropFilter: "blur(4px)" }}
          >
            {/* Drawer / modal */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl flex flex-col"
              style={{
                background: "#fdfbf7",
                border: "1px solid rgba(232,226,216,0.9)",
                boxShadow: "0 24px 80px rgba(30,26,23,0.18)",
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(232,226,216,0.8)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={15} style={{ color: "#e07a5f" }} />
                  <h2 className="text-[16px] font-semibold" style={{ color: "#1e1a17" }}>
                    Edit Profile
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl transition-colors hover:bg-[rgba(232,226,216,0.5)]"
                >
                  <X size={16} style={{ color: "#9e9890" }} />
                </button>
              </div>

              {/* Scrollable form body */}
              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5"
              >
                {/* Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Your name" />
                  <Field label="Role *" value={form.role} onChange={(v) => set("role", v)} placeholder="e.g. Product Designer" />
                  <Field label="Organization" value={form.organization} onChange={(v) => set("organization", v)} placeholder="e.g. Startup Inc." />
                </div>

                {/* Skills / Interests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TagInput label="Skills *" value={form.skills} onChange={(v) => set("skills", v)} placeholder="e.g. React, Python…" />
                  <TagInput label="Interests" value={form.interests} onChange={(v) => set("interests", v)} placeholder="e.g. AI, design…" />
                </div>

                {/* Goals / Looking For */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TagInput label="Goals" value={form.goals} onChange={(v) => set("goals", v)} placeholder="e.g. Launch product…" max={10} />
                  <TagInput label="Looking For" value={form.lookingFor} onChange={(v) => set("lookingFor", v)} placeholder="e.g. Co-founder…" max={10} />
                </div>

                {/* Projects */}
                <Field label="Current Projects" value={form.projects} onChange={(v) => set("projects", v)} placeholder="What are you building?" multiline />

                {error && (
                  <p className="text-[13px] font-medium" style={{ color: "#dc2626" }}>{error}</p>
                )}
              </form>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(232,226,216,0.8)" }}
              >
                <p className="text-[11.5px]" style={{ color: "#b8b2aa" }}>
                  Saving will regenerate your embeddings and refresh AI matches.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all duration-200"
                  style={{
                    background: step === "done"
                      ? "rgba(34,197,94,0.9)"
                      : "linear-gradient(135deg,#e07a5f,#d4694f)",
                    color: "white",
                    boxShadow: "0 2px 10px rgba(224,122,95,0.3)",
                    opacity: isPending && step !== "done" ? 0.85 : 1,
                    minWidth: "160px",
                    justifyContent: "center",
                  }}
                >
                  {step === "done" ? (
                    <Check size={14} />
                  ) : isPending ? (
                    <>
                      {step === "refreshing" ? <RefreshCw size={14} className="animate-spin" /> : <Loader2 size={14} className="animate-spin" />}
                    </>
                  ) : null}
                  {stepLabel[step]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
