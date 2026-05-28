"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const stats = [
  { end: 48000, display: "48K+", label: "Meaningful connections made", unit: "K+" },
  { end: 1200, display: "1,200+", label: "Startup collaborations launched", unit: "+" },
  { end: 94, display: "94%", label: "Match satisfaction rate", unit: "%" },
  { end: 180, display: "180+", label: "Active research communities", unit: "+" },
];

function useCounter(end: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, end, duration]);
  return value;
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(stat.end, inView);

  const displayCount =
    stat.end >= 1000
      ? count >= 1000
        ? `${(count / 1000).toFixed(0)}K${stat.unit.includes("%") ? "%" : "+"}`
        : `${count}`
      : stat.unit === "%"
      ? `${count}%`
      : `${count}${count >= stat.end ? "+" : ""}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      className="group bento-card flex flex-col gap-3 p-7 transition-all duration-300 hover:shadow-md"
      style={{ "--tw-shadow-color": "rgba(224,122,95,0.10)" } as React.CSSProperties}
    >
      {/* Stat value */}
      <span
        className="text-[2.8rem] font-bold leading-none tabular-nums"
        style={{
          fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
          color: "#1e1a17",
          letterSpacing: "-0.03em",
        }}
      >
        {inView ? displayCount : stat.display}
      </span>

      {/* Label */}
      <span className="text-[13px] font-medium leading-snug" style={{ color: "#9e9890" }}>
        {stat.label}
      </span>

      {/* Bottom accent line */}
      <div
        className="mt-1 h-0.5 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-14"
        style={{ background: "linear-gradient(90deg, #e07a5f, #f4a261)" }}
      />
    </motion.div>
  );
}

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative py-20 px-6" aria-label="Platform statistics">
      {/* Warm divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #e8e2d8, transparent)" }}
      />

      <div className="mx-auto max-w-6xl">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-[11px] font-bold uppercase tracking-[0.2em] mb-10"
          style={{ color: "#b8b2aa" }}
        >
          Trusted by ambitious people worldwide
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
