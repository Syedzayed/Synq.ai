"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

interface WelcomeBannerProps {
  name?: string | null;
  isNewUser?: boolean;
  onStart?: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "AI-powered matching",
    desc: "Your semantic fingerprint surfaces the right people.",
  },
  {
    icon: Users,
    title: "Curated connections",
    desc: "Quality over quantity. No cold outreach.",
  },
  {
    icon: Zap,
    title: "Fast setup",
    desc: "Complete your profile in under 3 minutes.",
  },
];

export function WelcomeBanner({ name, isNewUser = true, onStart }: WelcomeBannerProps) {
  const firstName = name ? name.split(" ")[0] : null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 sm:py-20">
      {/* Success tick */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex justify-center mb-8"
      >
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center relative"
          style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
        >
          <CheckCircle size={28} className="text-white" />
          {/* Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
          />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="text-center mb-10"
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: "#e07a5f" }}
        >
          {isNewUser ? "Account ready" : "Welcome back"}
        </p>

        <h1
          className="leading-[1.05] mb-4"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          {firstName ? (
            <>
              Welcome to Synq,{" "}
              <span className="italic" style={{ color: "#e07a5f" }}>
                {firstName}.
              </span>
            </>
          ) : (
            <>
              Welcome to{" "}
              <span className="italic" style={{ color: "#e07a5f" }}>
                Synq.
              </span>
            </>
          )}
        </h1>

        <p
          className="text-[16px] leading-relaxed max-w-md mx-auto"
          style={{ color: "#6b6560" }}
        >
          {isNewUser
            ? "Your account is ready. Let's help you discover people who move like you."
            : "Good to have you back. Your network is waiting."}
        </p>
      </motion.div>

      {/* Feature bento cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
      >
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: EASE }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,252,248,0.95)",
              border: "1px solid rgba(232,226,216,0.9)",
              boxShadow: "0 2px 12px rgba(58,53,48,0.05)",
            }}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: "rgba(224,122,95,0.10)",
              }}
            >
              <Icon size={17} style={{ color: "#e07a5f" }} />
            </div>
            <p
              className="text-[13.5px] font-semibold mb-1"
              style={{ color: "#1e1a17" }}
            >
              {title}
            </p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#9e9890" }}>
              {desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        className="flex flex-col items-center gap-4"
      >
        {onStart ? (
          <button
            id="onboarding-continue"
            onClick={onStart}
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
              boxShadow: "0 2px 16px rgba(224,122,95,0.35)",
            }}
          >
            Set up my profile
            <ArrowRight size={16} />
          </button>
        ) : (
          <Link
            id="onboarding-continue"
            href="/onboarding/profile"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
              boxShadow: "0 2px 16px rgba(224,122,95,0.35)",
            }}
          >
            Set up my profile
            <ArrowRight size={16} />
          </Link>
        )}

        <p className="text-[12.5px]" style={{ color: "#b8b2aa" }}>
          Takes about 3 minutes
        </p>
      </motion.div>
    </div>
  );
}
