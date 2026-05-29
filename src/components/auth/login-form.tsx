"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { loginSchema, type LoginInput } from "@/lib/validations";
import { supabase } from "@/lib/auth/supabase";
import { checkLoginRateLimit } from "@/actions/auth";
import { AuthCard } from "./auth-card";

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = "idle" | "loading" | "success" | "error";

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
  rightSlot?: React.ReactNode;
}

function FormField({
  label,
  id,
  type = "text",
  placeholder,
  error,
  autoComplete,
  registration,
  rightSlot,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold"
        style={{ color: "#3a3530" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
          style={{
            background: "#f8f4ef",
            border: error
              ? "1.5px solid rgba(201,96,74,0.6)"
              : "1.5px solid rgba(232,226,216,0.9)",
            color: "#1e1a17",
            boxShadow: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1.5px solid rgba(224,122,95,0.6)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(224,122,95,0.08)";
            e.currentTarget.style.background = "#fdfbf7";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = error
              ? "1.5px solid rgba(201,96,74,0.6)"
              : "1.5px solid rgba(232,226,216,0.9)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "#f8f4ef";
          }}
        />
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-[12px] overflow-hidden"
            style={{ color: "#c9604a" }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setFormState("loading");
    setErrorMessage("");

    // Server-side rate limit check
    const rl = await checkLoginRateLimit();
    if (!rl.allowed) {
      setFormState("error");
      setErrorMessage(rl.error ?? "Too many attempts. Please wait.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setFormState("error");
      setErrorMessage(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      );
      return;
    }

    setFormState("success");

    // Hard navigation so the browser sends the new Supabase session cookie
    // to Next.js on the next request — this lets proxy.ts refresh the session.
    // Also honour the ?next redirect param set by the proxy on protected routes.
    const next = searchParams.get("next");
    const destination =
      next && next.startsWith("/") ? next : "/onboarding";

    setTimeout(() => {
      window.location.href = destination;
    }, 800);
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";

  return (
    <AuthCard>
      {/* Heading */}
      <div className="mb-7">
        <h2
          className="mb-1.5 leading-tight"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.6rem, 3vw, 2rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Welcome back.
        </h2>
        <p className="text-[13.5px]" style={{ color: "#9e9890" }}>
          Sign in to continue building connections.
        </p>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {formState === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 flex items-start gap-3 rounded-2xl p-3.5"
            style={{
              background: "rgba(201,96,74,0.07)",
              border: "1px solid rgba(201,96,74,0.2)",
            }}
          >
            <AlertCircle size={15} style={{ color: "#c9604a", flexShrink: 0, marginTop: 1 }} />
            <p className="text-[13px]" style={{ color: "#c9604a" }}>
              {errorMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success banner */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-3 rounded-2xl p-3.5"
            style={{
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <CheckCircle size={15} className="text-green-500 shrink-0" />
            <p className="text-[13px] text-green-700">Signed in! Redirecting…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          label="Email address"
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <FormField
          label="Password"
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="Your password"
          autoComplete="current-password"
          registration={register("password")}
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="p-1 rounded-lg transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{ color: "#9e9890" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        {/* Submit */}
        <motion.button
          id="login-submit"
          type="submit"
          disabled={isLoading || isSuccess}
          whileHover={{ scale: isLoading || isSuccess ? 1 : 1.015 }}
          whileTap={{ scale: isLoading || isSuccess ? 1 : 0.985 }}
          className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white transition-all duration-200"
          style={{
            background:
              isLoading || isSuccess
                ? "rgba(224,122,95,0.6)"
                : "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
            boxShadow: isLoading || isSuccess
              ? "none"
              : "0 2px 12px rgba(224,122,95,0.35)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={16} />
              Signed in!
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div
        className="my-6 flex items-center gap-3"
        aria-hidden="true"
      >
        <div className="flex-1 h-px" style={{ background: "rgba(232,226,216,0.8)" }} />
        <span className="text-[11.5px] font-medium" style={{ color: "#c8c2ba" }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(232,226,216,0.8)" }} />
      </div>

      {/* Footer link */}
      <p className="text-center text-[13.5px]" style={{ color: "#9e9890" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          id="go-to-register"
          className="font-semibold transition-colors"
          style={{ color: "#e07a5f" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#c9604a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#e07a5f")
          }
        >
          Create Account
        </Link>
      </p>
    </AuthCard>
  );
}
