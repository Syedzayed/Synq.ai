"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "48K+", label: "Meaningful connections made" },
  { value: "1,200+", label: "Startup collaborations launched" },
  { value: "94%", label: "Match satisfaction rate" },
  { value: "180+", label: "Research communities" },
];

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="flex flex-col gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur-sm"
    >
      <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-sm text-white/40 leading-snug mt-1">{label}</span>
    </motion.div>
  );
}

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="relative py-24 px-6" aria-label="Synq stats">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-medium text-white/30 uppercase tracking-widest">
            Trusted by ambitious people
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
