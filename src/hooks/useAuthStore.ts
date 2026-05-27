/**
 * Zustand store for authenticated user state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserWithProfile } from "@/types";

interface AuthState {
  user: UserWithProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserWithProfile) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      clearUser: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "synq-auth", // localStorage key
      // Only persist non-sensitive fields
      partialize: (state) => ({
        user: state.user
          ? { id: state.user.id, email: state.user.email, name: state.user.name }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
