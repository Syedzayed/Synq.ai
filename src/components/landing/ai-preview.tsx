"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, Send } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const userMessage = "Find me people interested in AI startups and product design.";

const aiIntro = "Here are your top matches based on your profile:";

const aiMatches = [
  {
    name: "Priya Mehta",
    role: "Product Designer → AI Tools",
    location: "San Francisco",
    match: 98,
    tags: ["Product", "AI/UX", "Startups"],
    reason:
      "Designing interfaces for three AI-first products. Actively seeking technical co-founders with startup experience.",
    avatarBg: "linear-gradient(135deg, #e07a5f, #c9604a)",
  },
  {
    name: "Arjun Verma",
    role: "Founder · LLM Infrastructure",
    location: "London",
    match: 95,
    tags: ["LLMs", "Infrastructure", "Seed Stage"],
    reason:
      "Just closed seed round. Building the embedding layer for his platform. Looking for product and GTM partners.",
    avatarBg: "linear-gradient(135deg, #f4a261, #e07a5f)",
  },
  {
    name: "Sofia Reyes",
    role: "AI Researcher · Applied ML",
    location: "Berlin",
    match: 91,
    tags: ["Research", "Human-AI", "Advisory"],
    reason:
      "Publishes on human-AI collaboration. Consults early-stage startups on responsible AI product strategy.",
    avatarBg: "linear-gradient(135deg, #c9604a, #a84b38)",
  },
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "#e07a5f" }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1, 0.7] }}
          transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity }}
        />
      ))}
    </span>
  );
}

function MatchCard({
  match,
  index,
}: {
  match: (typeof aiMatches)[number];
  index: number;
}) {
  const scoreColor =
    match.match >= 96 ? "#22c55e" : match.match >= 92 ? "#e07a5f" : "#f4a261";
  const scoreBg =
    match.match >= 96
      ? "rgba(34,197,94,0.10)"
      : match.match >= 92
      ? "rgba(224,122,95,0.10)"
      : "rgba(244,162,97,0.10)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.15, ease: EASE }}
      className="rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm"
      style={{
        background: "rgba(253,251,247,0.9)",
        borderColor: "rgba(232,226,216,0.9)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: match.avatarBg }}
          >
            {match.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p
              className="text-[13.5px] font-bold leading-tight"
              style={{ color: "#1e1a17", letterSpacing: "-0.01em" }}
            >
              {match.name}
            </p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "#b8b2aa" }}>
              {match.role}
            </p>
          </div>
        </div>
        {/* Score badge */}
        <div
          className="shrink-0 flex items-center rounded-full px-2.5 py-1"
          style={{ background: scoreBg }}
        >
          <span className="text-[11.5px] font-bold" style={{ color: scoreColor }}>
            {match.match}% match
          </span>
        </div>
      </div>

      {/* Match bar */}
      <div className="mb-3 h-1 w-full rounded-full" style={{ background: "#f0ebe3" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${match.match}%` }}
          transition={{ duration: 0.9, delay: index * 0.15 + 0.3, ease: EASE }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #e07a5f, #f4a261)` }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {match.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10.5px] font-semibold rounded-full px-2.5 py-0.5"
            style={{
              background: "rgba(224,122,95,0.08)",
              color: "#c9604a",
              border: "1px solid rgba(224,122,95,0.15)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-[12px] leading-relaxed" style={{ color: "#b8b2aa" }}>
        {match.reason}
      </p>
    </motion.div>
  );
}

export function AiPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true });

  const [phase, setPhase] = useState<"idle" | "typing" | "results">("idle");
  const [visibleMatches, setVisibleMatches] = useState(0);

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const t1 = setTimeout(() => setPhase("typing"), 500);
    const t2 = setTimeout(() => setPhase("results"), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, phase]);

  useEffect(() => {
    if (phase !== "results") return;
    aiMatches.forEach((_, i) => {
      setTimeout(() => setVisibleMatches((v) => Math.max(v, i + 1)), i * 300 + 150);
    });
  }, [phase]);

  return (
    <section
      id="preview"
      className="relative py-28 px-6"
      aria-labelledby="preview-heading"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #e8e2d8, transparent)" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "#e07a5f" }}
          >
            AI Preview
          </motion.p>
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
            id="preview-heading"
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              color: "#1e1a17",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Talk to Synq.{" "}
            <span className="italic" style={{ color: "#e07a5f" }}>
              It listens differently.
            </span>
          </motion.h2>
        </div>

        {/* Chat window */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          className="mx-auto max-w-[640px]"
        >
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: "rgba(253,251,247,0.95)",
              border: "1px solid rgba(232,226,216,0.9)",
              boxShadow: "0 8px 40px rgba(58,53,48,0.10), 0 2px 8px rgba(58,53,48,0.05)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid rgba(232,226,216,0.7)" }}
            >
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ background: "#f0ebe3" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "#f0ebe3" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "#f0ebe3" }} />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div
                  className="h-5 w-5 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
                >
                  <Sparkles size={10} className="text-white" />
                </div>
                <span className="text-[11.5px] font-semibold" style={{ color: "#b8b2aa" }}>
                  Synq AI · Match Assistant
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10.5px]" style={{ color: "#b8b2aa" }}>Active</span>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5">
              {/* User message */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                className="flex items-end gap-3 flex-row-reverse"
              >
                <div
                  className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
                >
                  <User size={13} className="text-white" />
                </div>
                <div
                  className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%]"
                  style={{
                    background: "rgba(224,122,95,0.10)",
                    border: "1px solid rgba(224,122,95,0.18)",
                  }}
                >
                  <p className="text-[13px] leading-relaxed" style={{ color: "#3a3530" }}>
                    {userMessage}
                  </p>
                </div>
              </motion.div>

              {/* AI area */}
              <AnimatePresence mode="wait">
                {phase === "typing" && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-3"
                  >
                    <div
                      className="h-8 w-8 shrink-0 rounded-full border flex items-center justify-center"
                      style={{ background: "rgba(224,122,95,0.07)", borderColor: "rgba(224,122,95,0.18)" }}
                    >
                      <Bot size={13} style={{ color: "#e07a5f" }} />
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-sm px-4 py-3"
                      style={{ background: "#f5f0e8", border: "1px solid #e8e2d8" }}
                    >
                      <TypingDots />
                    </div>
                  </motion.div>
                )}

                {phase === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="h-8 w-8 shrink-0 mt-0.5 rounded-full border flex items-center justify-center"
                      style={{ background: "rgba(224,122,95,0.07)", borderColor: "rgba(224,122,95,0.18)" }}
                    >
                      <Bot size={13} style={{ color: "#e07a5f" }} />
                    </div>
                    <div className="flex flex-col gap-3 min-w-0 flex-1">
                      <p className="text-[12.5px] leading-relaxed" style={{ color: "#9e9890" }}>
                        {aiIntro}
                      </p>
                      {aiMatches.slice(0, visibleMatches).map((match, i) => (
                        <MatchCard key={match.name} match={match} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div
              className="px-4 py-4"
              style={{ borderTop: "1px solid rgba(232,226,216,0.7)" }}
            >
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-2.5"
                style={{ background: "#f5f0e8", border: "1px solid #e8e2d8" }}
              >
                <span className="text-[12.5px] flex-1 select-none" style={{ color: "#c8c2ba" }}>
                  Ask Synq anything…
                </span>
                <button
                  aria-label="Send message"
                  className="h-7 w-7 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
                >
                  <Send size={12} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Warm shadow glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none mt-1 mx-16 h-5 rounded-full blur-xl opacity-30"
            style={{ background: "rgba(224,122,95,0.35)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
