"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/auth/supabase";

const SPRING = { type: "spring" as const, stiffness: 280, damping: 28 };
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: EASE },
});

const AVATARS = [
  { initials: "AM", bg: "linear-gradient(135deg, #e07a5f, #c9604a)" },
  { initials: "JK", bg: "linear-gradient(135deg, #f4a261, #e07a5f)" },
  { initials: "MR", bg: "linear-gradient(135deg, #c9604a, #a84b38)" },
  { initials: "PS", bg: "linear-gradient(135deg, #f7b882, #f4a261)" },
  { initials: "LW", bg: "linear-gradient(135deg, #e07a5f, #f4a261)" },
];

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-24 text-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Soft ambient glow behind headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: "10vh" }}
      >
        <div
          className="h-[440px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(224,122,95,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Early access badge */}
      <motion.div {...fadeUp(0.1)}>
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-8"
          style={{
            background: "rgba(224,122,95,0.07)",
            borderColor: "rgba(224,122,95,0.20)",
            color: "#c9604a",
          }}
        >
          <Sparkles size={11} />
          AI-Powered Networking &middot; Early Access
        </div>
      </motion.div>

      {/* Headline — Instrument Serif for soul, warm colors */}
      <motion.h1
        {...fadeUp(0.18)}
        className="max-w-[820px] leading-[1.06]"
        style={{
          fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
          fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
          color: "#1e1a17",
          letterSpacing: "-0.02em",
          fontWeight: 400,
        }}
      >
        Find people who{" "}
        <span
          className="italic"
          style={{
            background: "linear-gradient(135deg, #e07a5f 20%, #f4a261 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          move like you.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        {...fadeUp(0.3)}
        className="mt-7 max-w-[500px] text-[1.05rem] leading-relaxed"
        style={{ color: "#9e9890", fontWeight: 400 }}
      >
        AI-powered networking for builders, creators, researchers, and ambitious
        teams. Stop cold outreach. Start meaningful connections.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        {...fadeUp(0.44)}
        className="mt-10 flex flex-col sm:flex-row items-center gap-3"
      >
        {isAuthenticated === null ? (
          <div className="w-40 h-12" />
        ) : isAuthenticated ? (
          <>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
              <Link
                href="/dashboard"
                id="hero-cta-primary"
                className="inline-flex h-12 items-center gap-2 rounded-full px-8 text-[14px] font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  boxShadow: "0 4px 20px rgba(224,122,95,0.30), 0 1px 4px rgba(224,122,95,0.15)",
                }}
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
              <Link
                href="/dashboard/discover"
                id="hero-cta-secondary"
                className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-[14px] font-semibold transition-all duration-200"
                style={{
                  borderColor: "rgba(58,53,48,0.14)",
                  color: "#6b6560",
                  background: "rgba(253,251,247,0.7)",
                }}
              >
                Discover People
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
              <Link
                href="/register"
                id="hero-cta-primary"
                className="inline-flex h-12 items-center gap-2 rounded-full px-8 text-[14px] font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  boxShadow: "0 4px 20px rgba(224,122,95,0.30), 0 1px 4px rgba(224,122,95,0.15)",
                }}
              >
                Get started free
                <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING}>
              <a
                href="#features"
                id="hero-cta-secondary"
                className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-[14px] font-semibold transition-all duration-200"
                style={{
                  borderColor: "rgba(58,53,48,0.14)",
                  color: "#6b6560",
                  background: "rgba(253,251,247,0.7)",
                }}
              >
                Explore Network
              </a>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Social proof avatars */}
      <motion.div {...fadeUp(0.58)} className="mt-14">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {AVATARS.map(({ initials, bg }, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: bg, borderColor: "#fdfbf7" }}
              >
                {initials[0]}
              </div>
            ))}
          </div>
          <p className="text-[13px]" style={{ color: "#b8b2aa" }}>
            <span className="font-semibold" style={{ color: "#6b6560" }}>2,400+</span>{" "}
            builders already connected
          </p>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
        style={{ background: "linear-gradient(to top, rgba(245,240,232,0.5), transparent)" }}
      />
    </section>
  );
}
