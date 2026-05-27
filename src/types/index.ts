/**
 * Shared TypeScript types for Synq
 */

// ─── User & Profile ───────────────────────────────────────────────────────────

export interface UserBase {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

export interface ProfileBase {
  id: string;
  userId: string;
  bio?: string | null;
  location?: string | null;
  industry?: string | null;
  goals: string[];
  skills: string[];
}

export type UserWithProfile = UserBase & {
  profile?: ProfileBase | null;
};

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Match ────────────────────────────────────────────────────────────────────

export interface MatchScore {
  userId: string;
  score: number;
  profile: ProfileBase & { name?: string | null };
}
