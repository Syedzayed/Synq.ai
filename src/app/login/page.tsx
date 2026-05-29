import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — Synq",
  description:
    "Sign in to Synq and reconnect with your network of builders, researchers, and creators.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      {/* Suspense required because LoginForm reads useSearchParams() */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
