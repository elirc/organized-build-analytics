import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role =
  | "SYSTEM_ADMIN"
  | "OPS_MANAGER"
  | "PRODUCT_MANAGER"
  | "ENGINEERING_ADMIN"
  | "AUDIT_VIEWER"
  | "EXECUTIVE_VIEWER"
  | "READ_ONLY";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (session) => set(session),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    {
      name: "analytics-admin-auth"
    }
  )
);
