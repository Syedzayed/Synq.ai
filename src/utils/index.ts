/**
 * Shared utility functions for Synq
 */

/**
 * Strip whitespace and normalize line endings.
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * Truncate a string to a max length, appending "..." if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Delay execution for a given number of milliseconds (async sleep).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON — returns null on failure instead of throwing.
 */
export function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Format a number as a percentage string.
 * e.g. 0.876 → "87.6%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
