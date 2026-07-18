import { apiClient, apiFetch } from "./client";

export interface ExportJob {
  id: string;
  exportType: string;
  status: string;
  createdAt: string;
  rowCount: number | null;
  fileUrl?: string | null;
  errorMessage?: string | null;
  completedAt?: string | null;
}

export function getExportJobs() {
  return apiClient<ExportJob[]>("/api/exports");
}

export function createExportJob(payload: { exportType: string; filters: Record<string, unknown> }) {
  return apiClient("/api/exports", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function retryExportJob(id: string) {
  return apiClient<ExportJob>(`/api/exports/${id}/retry`, {
    method: "POST"
  });
}

export async function downloadExportJob(id: string) {
  const response = await apiFetch(`/api/exports/${id}/download`);
  return response.blob();
}
