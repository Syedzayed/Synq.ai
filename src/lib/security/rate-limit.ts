/**
 * Security utilities — rate limiting, input sanitization, security headers.
 * Pure server-side helpers.
 */

// ─── In-memory rate limiter ────────────────────────────────────────────────────
// Simple sliding-window counter. In production, swap this for a Redis-backed
// store (e.g. @upstash/ratelimit) for multi-instance support.

interface RateLimitEntry {
  count: number;
  firstHit: number;
}

const store = new Map<string, RateLimitEntry>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  login: { max: 5, windowMs: 60_000 },     // 5 attempts per 60 s
  register: { max: 3, windowMs: 300_000 }, // 3 attempts per 5 min
};

/**
 * Checks whether an identifier (IP or email) has exceeded the rate limit
 * for the given action.
 *
 * @returns `{ allowed: boolean; remainingMs?: number }`
 */
export function checkRateLimit(
  action: keyof typeof LIMITS,
  identifier: string
): { allowed: boolean; remainingMs?: number } {
  const limit = LIMITS[action];
  if (!limit) return { allowed: true };

  const key = `${action}:${identifier}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.firstHit > limit.windowMs) {
    // First hit or window expired — reset
    store.set(key, { count: 1, firstHit: now });
    return { allowed: true };
  }

  if (entry.count >= limit.max) {
    const remainingMs = limit.windowMs - (now - entry.firstHit);
    return { allowed: false, remainingMs };
  }

  entry.count++;
  return { allowed: true };
}

// ─── Input sanitization ────────────────────────────────────────────────────────

/**
 * Strips leading/trailing whitespace and removes any null bytes from a string.
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\0/g, "");
}

/**
 * Normalizes an email address: trims, lowercases.
 */
export function normalizeEmail(email: string): string {
  return sanitizeString(email).toLowerCase();
}

// ─── Security headers ──────────────────────────────────────────────────────────

export const SECURE_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
