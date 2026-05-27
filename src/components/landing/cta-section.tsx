"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 px-6" aria-label="Call to action">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="mx-auto max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-12 md:p-20 text-center backdrop-blur-lg"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.15), transparent 70%)",
            }}
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-6">
              Get started
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Your next collaboration
              <br />
              is already nearby.
            </h2>
            <p className="text-base text-white/40 max-w-md mx-auto leading-relaxed mb-10">
              Join thousands of builders, researchers, and creators who found
              their best partners through Synq.
            </p>

            <Link
              href="/register"
              id="cta-final"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-indigo-600 px-10 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95"
            >
              Start Building Your Network
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>

            <p className="mt-5 text-xs text-white/25">
              Free forever for individuals · No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
