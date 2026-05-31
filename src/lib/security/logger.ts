/**
 * Premium Development Logging Module
 * Prints structured Bento-style telemetry logs in development mode.
 * Auto-disabled in production for maximum performance.
 */

type LogCategory = "SIGNUP" | "LOGIN" | "ONBOARDING" | "SESSION" | "PROFILE_CREATION" | "AI_MATCHING" | "SECURITY";

export function devLog(
  category: LogCategory,
  action: string,
  data: Record<string, any>,
  elapsedMs?: number
) {
  if (process.env.NODE_ENV !== "development") return;

  const timestamp = new Date().toLocaleTimeString();
  const performanceInfo = elapsedMs !== undefined ? ` ⏱️  [${elapsedMs}ms]` : "";

  console.log(
    `%c[SYNQ DEVLOG - ${timestamp}] %c[${category}] %c${action}${performanceInfo}`,
    "color: #9e9890; font-weight: bold;",
    "color: #e07a5f; font-weight: bold; background: rgba(224,122,95,0.08); padding: 2px 6px; rounded: 4px;",
    "color: #1e1a17; font-weight: 500;",
    data
  );
}

export class PerfTimer {
  private start: number;

  constructor() {
    this.start = Date.now();
  }

  stop(): number {
    return Date.now() - this.start;
  }
}
