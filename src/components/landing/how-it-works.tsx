"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserCircle2, BrainCircuit, Handshake } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: "01",
    icon: UserCircle2,
    title: "Create your profile",
    desc: "Tell Synq who you are through a natural conversation. No forms. Your AI profile reflects you authentically.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Let AI understand you",
    desc: "Synq generates a semantic vector of your goals, skills, and ambitions — updated as you grow.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Discover high-value connections",
    desc: "Receive curated matches ranked by genuine compatibility. Every suggestion comes with a clear explanation.",
  },
];

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
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            id="how-heading"
            className="text-4xl font-bold text-white tracking-tight"
          >
            Three steps to your
            <br />
            next great collaboration.
          </motion.h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-indigo-500/20 via-violet-500/30 to-indigo-500/20"
          />

          {steps.map(({ number, icon: Icon, title, desc }, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const ref = useRef<HTMLDivElement>(null);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const stepInView = useInView(ref, { once: true, margin: "-40px" });

            return (
              <motion.div
                key={title}
                ref={ref}
                initial={{ opacity: 0, y: 28 }}
                animate={stepInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.12, ease: EASE }}
                className="flex flex-col items-center text-center gap-5"
              >
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <Icon size={28} className="text-indigo-400" strokeWidth={1.4} />
                  </div>
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {number.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Step {number}
                  </p>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
