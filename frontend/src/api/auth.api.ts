import { apiClient } from "./client";
import type { AuthUser } from "../auth/auth.store";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export function login(payload: { email: string; password: string }) {
  return apiClient<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AuthUser["role"];
}) {
  return apiClient<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCurrentUser() {
  return apiClient<AuthUser>("/api/auth/me");
}

export function refreshSession(payload: { refreshToken: string }) {
  return apiClient<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout(payload: { refreshToken: string }) {
  return apiClient<void>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
