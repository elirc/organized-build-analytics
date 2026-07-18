import { Role } from "@prisma/client";

interface RangeInput {
  role: Role;
  startDate: string;
  endDate: string;
  interval?: string;
}

export const cacheKeys = {
  kpiSummary: ({ role, startDate, endDate }: RangeInput) =>
    `dashboard:kpi-summary:${role}:${startDate}:${endDate}`,
  eventsOverTime: ({ role, startDate, endDate, interval }: RangeInput) =>
    `dashboard:events-over-time:${role}:${startDate}:${endDate}:${interval ?? "day"}`,
  eventsByType: ({ role, startDate, endDate }: RangeInput) =>
    `dashboard:events-by-type:${role}:${startDate}:${endDate}`,
  auditSummary: ({ role, startDate, endDate }: RangeInput) =>
    `audit:summary:${role}:${startDate}:${endDate}`,
  monitoringSummary: ({ role, startDate, endDate }: RangeInput) =>
    `monitoring:summary:${role}:${startDate}:${endDate}`
};
