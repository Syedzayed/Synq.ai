/**
 * Welcome email sender.
 * Call this after a successful Supabase signUp.
 */
import "server-only";
import { resend, FROM_EMAIL } from "./resend";
import { WelcomeEmail } from "@/components/emails/welcome-email";

interface SendWelcomeEmailOptions {
  to: string;
  name?: string | null;
}

export async function sendWelcomeEmail({
  to,
  name,
}: SendWelcomeEmailOptions): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Synq — find people who move like you.",
      react: WelcomeEmail({ name: name ?? undefined }),
    });

    if (error) {
      console.error("[sendWelcomeEmail] Resend error:", error);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log(`[sendWelcomeEmail] sent to ${to}`);
      }
    }
  } catch (err) {
    // Never throw — a failed welcome email must not break registration.
    console.error("[sendWelcomeEmail] unexpected error:", err);
  }
}
