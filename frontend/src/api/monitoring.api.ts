import { apiClient } from "./client";
import type { DateRangeParams } from "./dashboard.api";

export function getMonitoringSummary(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<{
    averageApiLatencyMs: number;
    averageErrorRate: number;
    averageJobFailureRate: number;
    averageCacheHitRate: number;
    averageDbQueryTimeMs: number;
    queueDepth: {
      pending: number;
      processing: number;
      failed: number;
      total: number;
    };
  }>(`/api/monitoring/summary?${query}`);
}

export function getMonitoringSeries(
  path: "api-latency" | "error-rate" | "job-failures" | "cache-hit-rate" | "db-query-time",
  params: DateRangeParams
) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<Array<{ date: string; value: number; name: string }>>(`/api/monitoring/${path}?${query}`);
}

export function getQueueDepth() {
  return apiClient<{ pending: number; processing: number; failed: number; total: number }>(
    "/api/monitoring/queue-depth"
  );
}

export function getRecentJobFailures(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();

  return apiClient<Array<{ id: string; entityId: string | null; metadata: unknown; occurredAt: string }>>(
    `/api/monitoring/recent-job-failures?${query}`
  );
}
