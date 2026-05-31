"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";

import { registerFormSchema, type RegisterFormInput } from "@/lib/validations";
import { supabase } from "@/lib/auth/supabase";
import { postRegistration } from "@/actions/auth";
import { AuthCard } from "./auth-card";

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = "idle" | "loading" | "success" | "confirm-email" | "error";

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  hint?: string;
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
  hint,
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
            paddingRight: rightSlot ? "2.8rem" : undefined,
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
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-[12px] overflow-hidden"
            style={{ color: "#c9604a" }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        ) : hint ? (
          <p className="text-[12px]" style={{ color: "#b8b2aa" }}>
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function RegisterForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    setFormState("loading");
    setErrorMessage("");

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : "https://synq-ai-ten.vercel.app/login",
        data: {
          full_name: data.name,
        },
      },
    });

    if (error) {
      setFormState("error");
      setErrorMessage(
        error.message.includes("already registered")
          ? "An account with this email already exists. Try signing in."
          : error.message
      );
      return;
    }

    // Run post-registration: DB profile creation + welcome email
    if (authData.user) {
      const result = await postRegistration({
        supabaseId: authData.user.id,
        email: data.email,
        name: data.name,
      });

      if (!result.success && result.error) {
        // Non-fatal — account was created, but something else went wrong
        console.warn("[RegisterForm] postRegistration warning:", result.error);
      }
    }

    if (authData.session) {
      // Email confirmation is OFF — session is immediately available.
      // Hard-navigate so the browser sends the new session cookie to Next.js
      // and proxy.ts can hydrate the Supabase session on the next request.
      setFormState("success");
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1200);
    } else {
      // Email confirmation is ON — no session yet.
      // Show a "check your inbox" state instead of redirecting to a
      // protected page the user cannot access until they confirm.
      setFormState("confirm-email");
    }
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const isConfirmEmail = formState === "confirm-email";
  const isDone = isSuccess || isConfirmEmail;

  return (
    <AuthCard>
      {/* Heading */}
      <div className="mb-7">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: "#e07a5f" }}
        >
          Get started for free
        </p>
        <h2
          className="leading-tight mb-1.5"
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.6rem, 3vw, 2rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Create your account.
        </h2>
        <p className="text-[13.5px]" style={{ color: "#9e9890" }}>
          Start finding people who move like you.
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
            <AlertCircle
              size={15}
              style={{ color: "#c9604a", flexShrink: 0, marginTop: 1 }}
            />
            <p className="text-[13px]" style={{ color: "#c9604a" }}>
              {errorMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success banner (email confirmation OFF) */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 rounded-2xl p-3.5"
            style={{
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-green-700">
              Account created! Redirecting you now…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm-email banner (email confirmation ON) */}
      <AnimatePresence>
        {isConfirmEmail && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 rounded-2xl p-4"
            style={{
              background: "rgba(224,122,95,0.07)",
              border: "1px solid rgba(224,122,95,0.25)",
            }}
          >
            <Mail size={15} style={{ color: "#e07a5f", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#3a3530" }}>
                Check your inbox
              </p>
              <p className="text-[12.5px]" style={{ color: "#9e9890" }}>
                We sent a confirmation link to your email. Click it to activate
                your account, then{" "}
                <Link href="/login" className="underline" style={{ color: "#e07a5f" }}>
                  sign in here
                </Link>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          label="Full Name"
          id="register-name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          registration={register("name")}
          error={errors.name?.message}
        />

        <FormField
          label="Email address"
          id="register-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <FormField
          label="Password"
          id="register-password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          hint="Minimum 8 characters"
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

        <FormField
          label="Confirm Password"
          id="register-confirm-password"
          type={showConfirm ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="p-1 rounded-lg transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              style={{ color: "#9e9890" }}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        {/* Submit */}
        <motion.button
          id="register-submit"
          type="submit"
          disabled={isLoading || isDone}
          whileHover={{ scale: isLoading || isDone ? 1 : 1.015 }}
          whileTap={{ scale: isLoading || isDone ? 1 : 0.985 }}
          className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white transition-all duration-200"
          style={{
            background:
              isLoading || isDone
                ? "rgba(224,122,95,0.6)"
                : "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
            boxShadow:
              isLoading || isDone
                ? "none"
                : "0 2px 12px rgba(224,122,95,0.35)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={16} />
              Account created!
            </>
          ) : isConfirmEmail ? (
            <>
              <Mail size={16} />
              Check your email
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(232,226,216,0.8)" }}
        />
        <span className="text-[11.5px] font-medium" style={{ color: "#c8c2ba" }}>
          or
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(232,226,216,0.8)" }}
        />
      </div>

      {/* Footer link */}
      <p className="text-center text-[13.5px]" style={{ color: "#9e9890" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          id="go-to-login"
          className="font-semibold transition-colors"
          style={{ color: "#e07a5f" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9604a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#e07a5f")}
        >
          Sign In
        </Link>
      </p>

      {/* Legal */}
      <p
        className="text-center text-[11.5px] mt-4 leading-relaxed"
        style={{ color: "#c8c2ba" }}
      >
        By creating an account you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </AuthCard>
  );
}
