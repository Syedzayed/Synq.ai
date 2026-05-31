"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/auth/supabase";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#fdfbf7]/88 backdrop-blur-xl border-b border-[#e8e2d8]/80 shadow-sm shadow-[#e07a5f]/5"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-[62px] max-w-6xl items-center justify-between px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Synq home">
          <span
            className="h-7 w-7 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
          >
            <span className="text-white font-bold text-[12px] tracking-tight">S</span>
          </span>
          <span
            className="font-bold text-[16px]"
            style={{ color: "#1e1a17", letterSpacing: "-0.02em", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Synq
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7" role="list">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-[13.5px] font-medium transition-colors duration-150 hover:text-[#3a3530]"
                style={{ color: "#9e9890" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated === null ? (
            <div className="w-20 h-9" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/dashboard/discover"
                className="text-[13.5px] font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:bg-[#f0ebe3]"
                style={{ color: "#6b6560" }}
              >
                Discover People
              </Link>
              <Link
                href="/dashboard/chat"
                className="text-[13.5px] font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:bg-[#f0ebe3]"
                style={{ color: "#6b6560" }}
              >
                Chat with AI
              </Link>
              <Link
                href="/dashboard"
                id="nav-cta"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  boxShadow: "0 2px 12px rgba(224,122,95,0.25)",
                }}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13.5px] font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:bg-[#f0ebe3]"
                style={{ color: "#6b6560" }}
              >
                Log in
              </Link>
              <Link
                href="/register"
                id="nav-cta"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                  boxShadow: "0 2px 12px rgba(224,122,95,0.25)",
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl transition-colors duration-150 hover:bg-[#f0ebe3]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
          style={{ color: "#6b6560" }}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t px-6 pb-6"
            style={{ background: "#fdfbf7", borderColor: "#e8e2d8" }}
          >
            <ul className="flex flex-col gap-1 pt-4" role="list">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="block py-2.5 px-3 text-[14px] font-medium rounded-xl transition-colors"
                    style={{ color: "#6b6560" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2.5 mt-5 pt-4" style={{ borderTop: "1px solid #e8e2d8" }}>
              {isAuthenticated === null ? (
                <div className="h-20" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/discover"
                    className="text-[14px] text-center font-medium py-2.5 rounded-xl hover:bg-[#f0ebe3] transition-colors"
                    style={{ color: "#6b6560" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Discover People
                  </Link>
                  <Link
                    href="/dashboard/chat"
                    className="text-[14px] text-center font-medium py-2.5 rounded-xl hover:bg-[#f0ebe3] transition-colors"
                    style={{ color: "#6b6560" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Chat with AI
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-full text-[14px] font-semibold text-white text-center"
                    style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[14px] text-center font-medium py-2.5 rounded-xl hover:bg-[#f0ebe3] transition-colors"
                    style={{ color: "#6b6560" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex h-11 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
