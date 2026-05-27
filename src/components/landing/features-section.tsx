"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Search,
  MessageSquare,
  Lightbulb,
  Users,
  Zap,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    icon: Brain,
    title: "AI Matchmaking",
    desc: "Mistral-powered embeddings analyze your goals, skills, and trajectory to surface the people most aligned with your path.",
  },
  {
    icon: Search,
    title: "Semantic Discovery",
    desc: "Go beyond keywords. Synq understands intent — search by idea, goal, or problem, and find people thinking the same way.",
  },
  {
    icon: MessageSquare,
    title: "Conversational Onboarding",
    desc: "Your profile builds itself through a natural AI conversation. No boring forms. Just tell Synq who you are.",
  },
  {
    icon: Lightbulb,
    title: "Intelligent Recommendations",
    desc: "Synq learns your preferences over time and surfaces new connections as your focus evolves.",
  },
  {
    icon: Users,
    title: "Collaboration Matching",
    desc: "Looking for a co-founder, advisor, or collaborator? Synq identifies the right people for your specific need.",
  },
  {
    icon: Zap,
    title: "Real-time AI Insights",
    desc: "Understand why each match matters. Synq explains compatibility in plain language before you ever reach out.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: EASE }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 transition-colors group-hover:bg-indigo-500/15">
        <Icon size={18} strokeWidth={1.6} />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at 50% 0%, rgba(99,102,241,0.05), transparent 60%)",
        }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="features"
      className="relative py-28 px-6"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4"
          >
            Features
          </motion.p>
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            id="features-heading"
            className="text-4xl font-bold text-white tracking-tight leading-tight"
          >
            Built for how great
            <br />
            collaborations actually start.
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
