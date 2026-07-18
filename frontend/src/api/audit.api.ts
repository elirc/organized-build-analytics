import { apiClient } from "./client";
import type { DateRangeParams } from "./dashboard.api";

export function getAuditSummaryByAction(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<Array<{ action: string; count: number }>>(`/api/audit-events/summary/by-action?${query}`);
}

export function getAuditSummaryByActor(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<Array<{ actor: string; count: number }>>(`/api/audit-events/summary/by-actor?${query}`);
}

export function getAuditEvents(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<{ items: Array<{ id: string; action: string; entityType: string; createdAt: string; actor: { email: string } | null }>; total: number }>(
    `/api/audit-events?${query}`
  );
}

export function getAuditOverTime(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();

  return apiClient<Array<{ date: string; count: number }>>(`/api/audit-events/summary/over-time?${query}`);
}
