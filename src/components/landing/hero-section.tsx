"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
      {/* Central glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Badge */}
      <motion.div {...fadeUp(0.1)}>
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm mb-8">
          <Sparkles size={12} className="text-indigo-400" />
          AI-Powered Networking · Now in Early Access
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        {...fadeUp(0.2)}
        className="max-w-3xl text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]"
      >
        Find people who{" "}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
            move like you.
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-indigo-500/0 via-violet-500/60 to-indigo-500/0"
          />
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        {...fadeUp(0.35)}
        className="mt-7 max-w-xl text-lg text-white/45 leading-relaxed"
      >
        AI-powered networking for builders, creators, researchers, and ambitious
        teams. Stop cold outreach. Start meaningful connections.
      </motion.p>

      {/* CTAs */}
      <motion.div
        {...fadeUp(0.5)}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
      >
        <Link
          href="/register"
          id="hero-cta-primary"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95"
        >
          Get started free
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
        <a
          href="#features"
          id="hero-cta-secondary"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm font-semibold text-white/70 backdrop-blur transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-95"
        >
          Explore Network
        </a>
      </motion.div>

      {/* Social hint */}
      <motion.div {...fadeUp(0.65)} className="mt-14">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["AB", "JK", "MR", "PS", "LW"].map((initials, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: `hsl(${220 + i * 25}, 70%, 40%)` }}
              >
                {initials[0]}
              </div>
            ))}
          </div>
          <p className="text-sm text-white/35">
            <span className="text-white/60 font-semibold">2,400+</span> builders
            already connected
          </p>
        </div>
      </motion.div>

      {/* Scroll gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent"
      />
    </section>
  );
}
