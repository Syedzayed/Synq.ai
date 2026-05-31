"use client";

import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VerifiedPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center py-6">
          <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(107,144,128,0.1)", color: "#6b9080" }}>
            <CheckCircle2 size={30} />
          </div>
          
          <p
            className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: "#6b9080" }}
          >
            Verification Complete
          </p>
          
          <h2
            className="leading-tight mb-3"
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
              color: "#1e1a17",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Email Verified Successfully
          </h2>
          
          <p className="text-[14px] leading-relaxed mb-8" style={{ color: "#9e9890" }}>
            Your account is ready. You can now log in to construct your network and discover collaborative builders.
          </p>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
              boxShadow: "0 4px 14px rgba(224,122,95,0.3)",
            }}
          >
            Continue to Synq
            <Sparkles size={14} />
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
