"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft abstract illustration rendered purely with SVG/CSS gradients */
function WarmIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none" aria-hidden="true">
      {/* Outer glow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(224,122,95,0.18), rgba(244,162,97,0.14), rgba(224,122,95,0.06), rgba(244,162,97,0.18), rgba(224,122,95,0.18))",
          borderRadius: "50%",
          filter: "blur(24px)",
        }}
      />

      {/* Main SVG illustration */}
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full"
      >
        {/* Defs */}
        <defs>
          <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e07a5f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4a261" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f4a261" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9604a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#c9604a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nodeGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e07a5f" />
            <stop offset="100%" stopColor="#c9604a" />
          </linearGradient>
          <linearGradient id="nodeGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4a261" />
            <stop offset="100%" stopColor="#e07a5f" />
          </linearGradient>
          <linearGradient id="nodeGrad3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c9604a" />
            <stop offset="100%" stopColor="#a84b38" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow orbs */}
        <ellipse cx="160" cy="130" rx="130" ry="110" fill="url(#orb1)" />
        <ellipse cx="230" cy="200" rx="100" ry="90" fill="url(#orb2)" />
        <ellipse cx="90" cy="210" rx="95" ry="85" fill="url(#orb3)" />

        {/* Connection lines */}
        <line x1="160" y1="90" x2="100" y2="175" stroke="rgba(224,122,95,0.22)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="160" y1="90" x2="220" y2="175" stroke="rgba(244,162,97,0.22)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="100" y1="175" x2="160" y2="245" stroke="rgba(201,96,74,0.18)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="220" y1="175" x2="160" y2="245" stroke="rgba(224,122,95,0.18)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="100" y1="175" x2="220" y2="175" stroke="rgba(244,162,97,0.15)" strokeWidth="1" strokeDasharray="3 5" />

        {/* Node: center top (Synq logo node) */}
        <circle cx="160" cy="90" r="28" fill="url(#nodeGrad1)" filter="url(#glow)" />
        <text x="160" y="95" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">
          S
        </text>

        {/* Node: left */}
        <circle cx="100" cy="175" r="20" fill="url(#nodeGrad2)" opacity="0.9" />
        <text x="100" y="180" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="'Plus Jakarta Sans', sans-serif">
          PM
        </text>

        {/* Node: right */}
        <circle cx="220" cy="175" r="20" fill="url(#nodeGrad3)" opacity="0.9" />
        <text x="220" y="180" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="'Plus Jakarta Sans', sans-serif">
          AV
        </text>

        {/* Node: bottom */}
        <circle cx="160" cy="245" r="18" fill="url(#nodeGrad1)" opacity="0.75" />
        <text x="160" y="250" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="'Plus Jakarta Sans', sans-serif">
          SR
        </text>

        {/* Match badge near center */}
        <rect x="127" y="118" width="66" height="22" rx="11" fill="rgba(253,251,247,0.95)" />
        <text x="160" y="133" textAnchor="middle" fill="#e07a5f" fontSize="9.5" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">
          98% match
        </text>

        {/* Floating sparkle dots */}
        <circle cx="68" cy="105" r="4" fill="rgba(244,162,97,0.45)" />
        <circle cx="260" cy="135" r="3" fill="rgba(224,122,95,0.4)" />
        <circle cx="258" cy="250" r="5" fill="rgba(244,162,97,0.3)" />
        <circle cx="55" cy="248" r="3.5" fill="rgba(201,96,74,0.35)" />
      </svg>

      {/* Floating glow beneath */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 blur-2xl rounded-full opacity-30"
        style={{ background: "rgba(224,122,95,0.5)" }}
      />
    </div>
  );
}

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Shown in the right-panel heading area */
  pageTitle?: string;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: "#fdfbf7" }}
    >
      {/* ─── Left panel — branding ──────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between relative overflow-hidden px-12 py-10"
        style={{
          background: "linear-gradient(145deg, #fdf8f3 0%, #f8f1e8 55%, #f3ebe0 100%)",
          borderRight: "1px solid rgba(232,226,216,0.7)",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/4 -translate-y-1/4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(224,122,95,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/4 translate-y-1/4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,162,97,0.09) 0%, transparent 70%)",
          }}
        />

        {/* Top: Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #e07a5f, #f4a261)",
              }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "#1e1a17" }}
            >
              Synq
            </span>
          </Link>
        </motion.div>

        {/* Center: Tagline + illustration */}
        <div className="flex flex-col items-start gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: "#e07a5f" }}
            >
              AI Networking
            </p>
            <h1
              className="leading-[1.05] mb-5"
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                color: "#1e1a17",
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              Find people who{" "}
              <span className="italic" style={{ color: "#e07a5f" }}>
                move like you.
              </span>
            </h1>
            <p
              className="text-[15px] leading-relaxed max-w-sm"
              style={{ color: "#6b6560" }}
            >
              Synq uses AI to surface the right people — not the most popular
              ones. Join builders, researchers, and creators who believe
              serendipity should be engineered.
            </p>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="w-full"
          >
            <WarmIllustration />
          </motion.div>
        </div>

        {/* Bottom: trust signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {["#e07a5f", "#f4a261", "#c9604a", "#e8927a"].map((bg, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: bg }}
              >
                {["PM", "AV", "SR", "JK"][i]}
              </div>
            ))}
          </div>
          <p className="text-[12.5px]" style={{ color: "#9e9890" }}>
            <span className="font-semibold" style={{ color: "#3a3530" }}>
              2,400+
            </span>{" "}
            builders already on Synq
          </p>
        </motion.div>
      </div>

      {/* ─── Right panel — auth slot ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 relative">
        {/* Mobile logo — shown only on small screens */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="lg:hidden mb-10 flex items-center gap-2.5"
        >
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: "#1e1a17" }}>
            Synq
          </span>
        </motion.div>

        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
