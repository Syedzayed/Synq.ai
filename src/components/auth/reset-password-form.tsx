"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { resetPasswordFormSchema, type ResetPasswordFormInput } from "@/lib/validations";
import { supabase } from "@/lib/auth/supabase";
import { AuthCard } from "./auth-card";

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = "idle" | "loading" | "success" | "error";

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  registration: any;
  error?: string;
  rightSlot?: React.ReactNode;
}

function FormField({
  label,
  id,
  type,
  placeholder,
  autoComplete,
  registration,
  error,
  rightSlot,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-[12.5px] font-semibold select-none"
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
          className="w-full rounded-2xl px-4 py-3 text-[14px] font-medium outline-none transition-all duration-200"
          style={{
            background: "#f8f4ef",
            border: error
              ? "1.5px solid rgba(201,96,74,0.6)"
              : "1.5px solid rgba(232,226,216,0.9)",
            color: "#1e1a17",
            paddingRight: rightSlot ? "44px" : "16px",
            boxShadow: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1.5px solid rgba(224,122,95,0.6)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(224,122,95,0.08)";
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
            className="flex items-center gap-1.5 text-[12px] overflow-hidden mt-0.5"
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

export function ResetPasswordForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormInput) => {
    setFormState("loading");
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setFormState("error");
      setErrorMessage(error.message);
      return;
    }

    setFormState("success");

    // Cleanly sign out the session to require a clean login with their new password
    await supabase.auth.signOut();

    setTimeout(() => {
      router.push("/login?message=Password reset successfully. Please log in with your new password.");
    }, 1800);
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
          Create New Password.
        </h2>
        <p className="text-[13.5px]" style={{ color: "#9e9890" }}>
          Ensure your password is at least 8 characters.
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
              background: "rgba(107,144,128,0.07)",
              border: "1px solid rgba(107,144,128,0.2)",
            }}
          >
            <CheckCircle2 size={15} className="shrink-0" style={{ color: "#6b9080" }} />
            <p className="text-[13px]" style={{ color: "#6b9080" }}>
              Your password has been updated.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      {!isSuccess && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField
            label="New password"
            id="reset-password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            registration={register("password")}
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="hover:opacity-80 transition-opacity"
                style={{ color: "#6b6560" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <FormField
            label="Confirm new password"
            id="reset-confirm"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="hover:opacity-80 transition-opacity"
                style={{ color: "#6b6560" }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-[14.5px] font-semibold text-white transition-all duration-200 cursor-pointer mt-2"
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #d4694f 100%)",
              boxShadow: "0 4px 14px rgba(224,122,95,0.25)",
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                Updating Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
