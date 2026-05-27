/**
 * Zod validation schemas for Synq
 */

import { z } from "zod";

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  goals: z.array(z.string().max(50)).max(10),
  skills: z.array(z.string().max(50)).max(20),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
