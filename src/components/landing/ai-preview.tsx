"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const userMessage =
  "Find me people interested in AI startups and product design.";

const aiResponse = [
  {
    name: "Priya Mehta",
    role: "Product Designer → AI Tools",
    match: "98%",
    reason:
      "Priya is designing interfaces for three AI-first products and is actively seeking technical co-founders with startup experience.",
  },
  {
    name: "Arjun Verma",
    role: "Founder · LLM Infrastructure",
    match: "95%",
    reason:
      "Arjun just closed a seed round and is building the embedding layer for his platform. Looking for product and GTM partners.",
  },
  {
    name: "Sofia Reyes",
    role: "AI Researcher · Applied ML",
    match: "91%",
    reason:
      "Sofia publishes on human-AI collaboration and consults early-stage startups on responsible AI product strategy.",
  },
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </span>
  );
}

export function AiPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [showTyping, setShowTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setShowTyping(true), 600);
    const t2 = setTimeout(() => {
      setShowTyping(false);
      setShowResponse(true);
    }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  useEffect(() => {
    if (!showResponse) return;
    aiResponse.forEach((_, i) => {
      setTimeout(() => setVisibleCards((v) => Math.max(v, i + 1)), i * 300);
    });
  }, [showResponse]);

  return (
    <section
      id="preview"
      className="relative py-28 px-6"
      aria-labelledby="preview-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4"
          >
            AI Preview
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            id="preview-heading"
            className="text-4xl font-bold text-white tracking-tight"
          >
            Talk to Synq.
            <br />
            It listens differently.
          </motion.h2>
        </div>

        {/* Chat window */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-lg overflow-hidden shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-white/10" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Sparkles size={12} className="text-indigo-400" />
                <span className="text-xs font-medium text-white/40">
                  Synq AI · Match Assistant
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* User message */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-3 flex-row-reverse"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="rounded-2xl rounded-tr-sm bg-indigo-600/20 border border-indigo-500/20 px-4 py-3 max-w-xs">
                  <p className="text-sm text-white/80 leading-relaxed">
                    {userMessage}
                  </p>
                </div>
              </motion.div>

              {/* AI typing or response */}
              {showTyping && !showResponse && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <Bot size={14} className="text-indigo-400" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                    <TypingDots />
                  </div>
                </div>
              )}

              {showResponse && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <Bot size={14} className="text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-3 min-w-0 flex-1">
                    <p className="text-sm text-white/50 leading-relaxed">
                      Here are your top matches right now:
                    </p>
                    {aiResponse.slice(0, visibleCards).map(({ name, role, match, reason }, i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-white">{name}</p>
                            <p className="text-xs text-white/40 mt-0.5">{role}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-emerald-400 bg-emerald-400/10 rounded-full px-2.5 py-1">
                            {match} match
                          </span>
                        </div>
                        <p className="text-xs text-white/35 leading-relaxed">{reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                <span className="text-sm text-white/20 flex-1">
                  Ask Synq anything…
                </span>
                <div className="h-6 w-6 rounded-lg bg-indigo-600/40 flex items-center justify-center">
                  <Sparkles size={11} className="text-indigo-300" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
