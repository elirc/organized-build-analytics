import { apiClient } from "./client";
import type { DateRangeParams } from "./dashboard.api";

export interface EventRow {
  id: string;
  eventType: string;
  entityType: string | null;
  entityId: string | null;
  actorEmail: string | null;
  occurredAt: string;
  metadata?: Record<string, unknown> | null;
}

export function getEvents(params: DateRangeParams & { eventType?: string; page?: number; pageSize?: number }) {
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (value !== undefined) accumulator[key] = String(value);
      return accumulator;
    }, {})
  ).toString();

  return apiClient<{ items: EventRow[]; total: number; page: number; pageSize: number }>(`/api/events?${query}`);
}

export function getEventById(id: string) {
  return apiClient<EventRow>(`/api/events/${id}`);
}
