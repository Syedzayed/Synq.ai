/**
 * Resend email client — server-only singleton.
 */
import "server-only";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "Missing RESEND_API_KEY environment variable. Add it to .env."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@synq.app";
