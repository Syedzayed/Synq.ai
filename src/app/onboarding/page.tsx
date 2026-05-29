import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding — Synq",
  description: "Set up your Synq profile.",
};

/**
 * Placeholder — onboarding flow will be built separately.
 * Successful auth redirects here.
 */
export default function OnboardingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#fdfbf7" }}
    >
      <div
        className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
        style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
      >
        S
      </div>
      <h1
        className="text-2xl font-medium"
        style={{
          fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
          color: "#1e1a17",
        }}
      >
        Onboarding coming soon.
      </h1>
      <p className="text-[14px]" style={{ color: "#9e9890" }}>
        Authentication successful — this page will be built next.
      </p>
    </div>
  );
}
