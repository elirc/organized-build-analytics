import { useAuthStore } from "../auth/auth.store";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiFetch(path: string, init?: RequestInit) {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message ?? "Request failed");
  }

  return response;
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init);

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
