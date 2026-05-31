"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/auth/supabase";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD = 27 * 60 * 1000; // Warning starts after 27 minutes
const SYNC_CHANNEL_NAME = "synq-auth-sync";

interface SessionTimeoutContextType {
  resetTimer: () => void;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | null>(null);

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3-minute grace period
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  const lastActiveRef = useRef<number>(Date.now());
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const router = useRouter();

  // Reset inactivity timer
  const resetTimer = () => {
    lastActiveRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      // Notify other tabs to dismiss their warning
      broadcastChannelRef.current?.postMessage({ type: "SESSION_KEEP_ALIVE" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowWarning(false);
    setIsUserLoggedIn(false);
    
    // Notify all other tabs
    broadcastChannelRef.current?.postMessage({ type: "SESSION_LOGOUT" });
    
    router.push("/login?message=You have been logged out due to inactivity.");
    router.refresh();
  };

  const handleKeepAlive = async () => {
    // Touch session with supabase
    await supabase.auth.getSession();
    resetTimer();
  };

  useEffect(() => {
    // Initialize session checking
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsUserLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsUserLoggedIn(!!session);
      if (event === "SIGNED_OUT") {
        setShowWarning(false);
        setIsUserLoggedIn(false);
      }
    });

    // Cross-tab synchronization via BroadcastChannel
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastChannelRef.current = channel;
      channel.onmessage = (event) => {
        if (event.data.type === "SESSION_LOGOUT") {
          setIsUserLoggedIn(false);
          setShowWarning(false);
          router.push("/login?message=Logged out from another tab.");
          router.refresh();
        } else if (event.data.type === "SESSION_KEEP_ALIVE") {
          setShowWarning(false);
          lastActiveRef.current = Date.now();
        }
      };
    } catch (err) {
      console.warn("[SessionTimeout] BroadcastChannel not supported:", err);
    }

    // Event listeners to detect activity
    const activityEvents = ["mousemove", "mousedown", "keypress", "scroll", "click", "touchstart"];
    const handleActivity = () => resetTimer();

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, handleActivity, { passive: true });
    });

    // Check inactivity every 10 seconds
    checkIntervalRef.current = setInterval(() => {
      if (!isUserLoggedIn) return;

      const elapsed = Date.now() - lastActiveRef.current;

      if (elapsed >= INACTIVITY_LIMIT) {
        handleLogout();
      } else if (elapsed >= WARNING_THRESHOLD) {
        if (!showWarning) {
          setShowWarning(true);
          const remainingSeconds = Math.max(0, Math.floor((INACTIVITY_LIMIT - elapsed) / 1000));
          setCountdown(remainingSeconds);
        }
      } else {
        if (showWarning) {
          setShowWarning(false);
        }
      }
    }, 10000);

    return () => {
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, handleActivity);
      });
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      subscription.unsubscribe();
      try {
        broadcastChannelRef.current?.close();
      } catch {}
    };
  }, [isUserLoggedIn, showWarning]);

  // Handle warning countdown ticker
  useEffect(() => {
    if (showWarning && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <SessionTimeoutContext.Provider value={{ resetTimer }}>
      {children}

      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1e1a17]/40 backdrop-blur-md"
              onClick={handleKeepAlive}
            />

            {/* Premium Glass Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8"
              style={{
                background: "rgba(255, 252, 248, 0.98)",
                border: "1px solid rgba(232, 226, 216, 0.9)",
                boxShadow: "0 20px 50px rgba(30, 26, 23, 0.15)",
              }}
            >
              {/* Alert Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(224,122,95,0.08)", color: "#e07a5f" }}
                >
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3
                    className="font-bold text-[18px]"
                    style={{ color: "#1e1a17", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    Session Expiring Soon
                  </h3>
                  <p className="text-[13px]" style={{ color: "#9e9890" }}>
                    For your security, you are about to be signed out.
                  </p>
                </div>
              </div>

              {/* Countdown Progress Card */}
              <div
                className="rounded-2xl p-4 mb-6 text-center"
                style={{ background: "#fcfaf6", border: "1px solid #e8e2d8" }}
              >
                <p className="text-[12px] uppercase tracking-[0.12em] mb-1" style={{ color: "#9e9890" }}>
                  Signing out in
                </p>
                <div
                  className="text-4xl font-bold flex items-center justify-center gap-2"
                  style={{ color: "#e07a5f", fontFamily: "Geist Mono, monospace" }}
                >
                  <Clock className="animate-pulse" size={28} />
                  {formatTime(countdown)}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border text-[13.5px] font-semibold transition-all duration-150 active:scale-[0.98]"
                  style={{ borderColor: "rgba(58,53,48,0.15)", color: "#6b6560", background: "transparent" }}
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={handleKeepAlive}
                  className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-[13.5px] font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                    boxShadow: "0 2px 10px rgba(224,122,95,0.2)",
                  }}
                >
                  Stay Logged In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SessionTimeoutContext.Provider>
  );
}

export function useSessionTimeout() {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error("useSessionTimeout must be used within a SessionTimeoutProvider");
  }
  return context;
}
