import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synq — Find people who move like you.",
  description:
    "Synq is an AI-powered networking platform that matches you with the right people based on your goals, skills, and momentum.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-6 text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI-Powered Networking
        </div>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Find people who{" "}
          <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
            move like you.
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-md leading-relaxed">
          Synq uses AI to match you with founders, builders, and creators who
          share your goals and complement your skills.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-8 text-sm font-semibold text-white transition-all hover:bg-violet-500 active:scale-95"
          >
            Get started free
          </a>
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white/80 backdrop-blur transition-all hover:bg-white/10 active:scale-95"
          >
            Sign in
          </a>
        </div>
      </div>

      {/* Footer hint */}
      <p className="absolute bottom-6 text-xs text-white/20">
        Synq · Foundational architecture · v0.1
      </p>
    </main>
  );
}
