"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 280, damping: 26 };

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 px-6" aria-label="Call to action">
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #e8e2d8, transparent)" }}
      />

      <div className="mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
          className="relative overflow-hidden rounded-[32px] text-center"
          style={{
            background: "linear-gradient(145deg, #fdf8f3 0%, #f8f1e8 50%, #f5ece0 100%)",
            border: "1px solid rgba(224,122,95,0.15)",
            boxShadow: "0 4px 40px rgba(224,122,95,0.10), 0 1px 6px rgba(58,53,48,0.06)",
            padding: "clamp(3rem, 8vw, 5rem) clamp(2rem, 6vw, 4rem)",
          }}
        >
          {/* Background clay gradient blob */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(224,122,95,0.12), transparent 65%)",
            }}
          />

          {/* Top warm border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(224,122,95,0.4), rgba(244,162,97,0.4), transparent)",
            }}
          />

          <div className="relative">
            {/* Eyebrow label */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-widest mb-7"
              style={{
                background: "rgba(224,122,95,0.10)",
                border: "1px solid rgba(224,122,95,0.18)",
                color: "#c9604a",
              }}
            >
              Free forever for individuals
            </div>

            <h2
              className="mx-auto max-w-xl mb-5"
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                color: "#1e1a17",
                letterSpacing: "-0.025em",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Your next collaboration is{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                already nearby.
              </span>
            </h2>

            <p
              className="mx-auto max-w-sm text-[14.5px] leading-relaxed mb-10"
              style={{ color: "#9e9890" }}
            >
              Join thousands of builders, researchers, and creators who found
              their best partners through Synq.
            </p>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="inline-block"
            >
              <Link
                href="/register"
                id="cta-final"
                className="inline-flex h-13 items-center gap-2.5 rounded-full px-10 text-[14.5px] font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  boxShadow: "0 6px 28px rgba(224,122,95,0.35), 0 2px 8px rgba(224,122,95,0.20)",
                  height: "52px",
                }}
              >
                Start Building Your Network
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            <p className="mt-5 text-[12px]" style={{ color: "#c8c2ba" }}>
              No credit card required &middot; Get started in 60 seconds
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
