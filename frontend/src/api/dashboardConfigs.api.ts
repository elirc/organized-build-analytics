import { apiClient } from "./client";

export function getDashboardConfigs() {
  return apiClient<Array<{ id: string; name: string; role: string; description: string | null; isDefault: boolean; layoutJson: Record<string, unknown> }>>("/api/dashboard-configs");
}

export function createDashboardConfig(payload: {
  name: string;
  description?: string;
  role: string;
  isDefault?: boolean;
  layoutJson: Record<string, unknown>;
}) {
  return apiClient("/api/dashboard-configs", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateDashboardConfig(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    role: string;
    isDefault: boolean;
    layoutJson: Record<string, unknown>;
  }>
) {
  return apiClient(`/api/dashboard-configs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteDashboardConfig(id: string) {
  return apiClient<void>(`/api/dashboard-configs/${id}`, {
    method: "DELETE"
  });
}
