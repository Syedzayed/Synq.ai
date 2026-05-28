"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserCircle2, BrainCircuit, Handshake } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 280, damping: 28 };

const steps = [
  {
    number: "01",
    icon: UserCircle2,
    title: "Create your profile",
    desc: "Tell Synq who you are through a natural conversation. No forms. No checkboxes. Your AI profile reflects you authentically.",
    accent: "#e07a5f",
    accentBg: "rgba(224,122,95,0.09)",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Let AI understand you",
    desc: "Synq generates a semantic vector of your goals, skills, and ambitions — updated automatically as you grow.",
    accent: "#f4a261",
    accentBg: "rgba(244,162,97,0.09)",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Discover high-value connections",
    desc: "Receive curated matches ranked by genuine compatibility. Every suggestion comes with a clear, plain-language explanation.",
    accent: "#c9604a",
    accentBg: "rgba(201,96,74,0.09)",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.13, ease: EASE }}
      whileHover={{ y: -4, transition: SPRING }}
      className="bento-card group flex flex-col gap-6 p-8"
    >
      {/* Number + Icon row */}
      <div className="flex items-start justify-between">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{ background: step.accentBg }}
        >
          <Icon size={26} strokeWidth={1.4} style={{ color: step.accent }} />
        </div>
        <span
          className="text-[3rem] font-bold leading-none select-none"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            color: "rgba(58,53,48,0.08)",
            letterSpacing: "-0.04em",
          }}
        >
          {step.number}
        </span>
      </div>

      {/* Text */}
      <div className="space-y-2.5">
        <h3
          className="text-[16px] font-bold"
          style={{ color: "#1e1a17", letterSpacing: "-0.01em" }}
        >
          {step.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "#9e9890" }}>
          {step.desc}
        </p>
      </div>

      {/* Accent tag */}
      <div
        className="inline-flex self-start items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
        style={{ background: step.accentBg, color: step.accent }}
      >
        Step {step.number}
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(headingRef, { once: true });

  return (
    <section
      id="how-it-works"
      className="relative py-28 px-6"
      aria-labelledby="how-heading"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #e8e2d8, transparent)" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "#e07a5f" }}
          >
            How it works
          </motion.p>
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
            id="how-heading"
            className="mx-auto max-w-lg"
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              color: "#1e1a17",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Three steps to your{" "}
            <span className="italic" style={{ color: "#e07a5f" }}>
              next great
            </span>{" "}
            collaboration.
          </motion.h2>
        </div>

        {/* Steps bento grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
