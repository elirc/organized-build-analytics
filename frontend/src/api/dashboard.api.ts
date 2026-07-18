import { apiClient } from "./client";

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export interface KpiSummary {
  totalEvents: number;
  activeUsers: number;
  failedEvents: number;
  errorRate: number;
  csvExports: number;
  adminActions?: number;
  averageApiLatencyMs?: number;
  backgroundJobFailures?: number;
}

export interface EventsOverTimeResponse {
  interval: string;
  data: { date: string; count: number }[];
}

export interface ErrorRatePoint {
  date: string;
  totalEvents: number;
  failedEvents: number;
  errorRate: number;
}

export function getKpiSummary(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<KpiSummary>(`/api/dashboard/kpi-summary?${query}`);
}

export function getEventsOverTime(params: DateRangeParams & { interval?: string }) {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (value) accumulator[key] = value;
      return accumulator;
    }, {})
  ).toString();

  return apiClient<EventsOverTimeResponse>(`/api/dashboard/events-over-time?${query}`);
}

export function getEventsByType(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<Array<{ eventType: string; count: number }>>(`/api/dashboard/events-by-type?${query}`);
}

export function getRecentActivity(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();
  return apiClient<Array<{ id: string; eventType: string; actorEmail: string | null; occurredAt: string }>>(
    `/api/dashboard/recent-activity?${query}`
  );
}

export function getActiveUsers(params: DateRangeParams & { interval?: string }) {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (value) accumulator[key] = value;
      return accumulator;
    }, {})
  ).toString();

  return apiClient<Array<{ date: string; activeUsers: number }>>(`/api/dashboard/active-users?${query}`);
}

export function getErrorRateSeries(params: DateRangeParams & { interval?: string }) {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (value) accumulator[key] = value;
      return accumulator;
    }, {})
  ).toString();

  return apiClient<ErrorRatePoint[]>(`/api/dashboard/error-rate?${query}`);
}

export function getConversionFunnel(params: DateRangeParams) {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate
  }).toString();

  return apiClient<Array<{ stage: string; count: number; conversionRate: number }>>(
    `/api/dashboard/conversion-funnel?${query}`
  );
}
