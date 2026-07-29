"use client";

import { create } from "zustand";
import type { AuthUser } from "@/lib/types";

// Client-side view of who is signed in, for UI (role gating, header, etc.).
// The httpOnly cookie remains the real credential; this is display state only,
// so nothing sensitive lives here and there is no persistence to storage.
interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));