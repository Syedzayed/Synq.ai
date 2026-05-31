"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Search, MessageSquare, Lightbulb, Users, Zap } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };

const features = [
  {
    icon: Brain,
    title: "AI Matchmaking",
    desc: "Mistral-powered embeddings analyze your goals, skills, and trajectory to surface people most aligned with your path.",
    accent: "#e07a5f",
    accentBg: "rgba(224,122,95,0.08)",
    size: "lg", // large bento card
  },
  {
    icon: Search,
    title: "Semantic Discovery",
    desc: "Go beyond keywords. Search by idea, goal, or problem and find people thinking the same way.",
    accent: "#f4a261",
    accentBg: "rgba(244,162,97,0.08)",
    size: "sm",
  },
  {
    icon: MessageSquare,
    title: "Conversational Onboarding",
    desc: "Your profile builds itself through a natural AI conversation. No forms. Just tell Synq who you are.",
    accent: "#c9604a",
    accentBg: "rgba(201,96,74,0.08)",
    size: "sm",
  },
  {
    icon: Lightbulb,
    title: "Intelligent Recommendations",
    desc: "Synq learns your preferences over time and surfaces new connections as your focus evolves.",
    accent: "#f4a261",
    accentBg: "rgba(244,162,97,0.07)",
    size: "sm",
  },
  {
    icon: Users,
    title: "Collaboration Matching",
    desc: "Looking for a co-founder, advisor, or collaborator? Synq identifies the right people for your specific need.",
    accent: "#e07a5f",
    accentBg: "rgba(224,122,95,0.07)",
    size: "sm",
  },
  {
    icon: Zap,
    title: "Real-time AI Insights",
    desc: "Understand why each match matters. Synq explains compatibility in plain language before you ever reach out.",
    accent: "#c9604a",
    accentBg: "rgba(201,96,74,0.07)",
    size: "lg",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.09, ease: EASE }}
      whileHover={{ y: -3, transition: SPRING }}
      className="bento-card group flex flex-col gap-5 p-7 cursor-default transition-shadow duration-300 hover:shadow-lg"
      style={{ boxShadow: "0 1px 3px rgba(58,53,48,0.06)" }}
    >
      {/* Icon */}
      <motion.div
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300"
        style={{ background: feature.accentBg }}
        whileHover={{ scale: 1.08 }}
        transition={SPRING}
      >
        <Icon size={20} strokeWidth={1.8} style={{ color: feature.accent }} />
      </motion.div>

      {/* Content */}
      <div className="space-y-2.5">
        <h3
          className="text-[15px] font-bold"
          style={{ color: "#1e1a17", letterSpacing: "-0.01em" }}
        >
          {feature.title}
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: "#9e9890" }}>
          {feature.desc}
        </p>
      </div>

      {/* Hover reveal accent */}
      <div
        className="mt-auto h-0.5 rounded-full scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      id="features"
      className="relative py-28 px-6"
      aria-labelledby="features-heading"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #e8e2d8, transparent)" }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "#e07a5f" }}
          >
            Features
          </motion.p>
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
            id="features-heading"
            className="leading-[1.1]"
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              color: "#1e1a17",
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            Built for how great{" "}
            <span className="italic" style={{ color: "#e07a5f" }}>
              collaborations
            </span>{" "}
            actually start.
          </motion.h2>
        </div>

        {/* Bento grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
