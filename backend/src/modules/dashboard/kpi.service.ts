import { cacheKeys } from "../../cache/cacheKeys.js";
import { cacheService } from "../../cache/cache.service.js";
import { applyMetricVisibility } from "../../shared/permissions.js";
import { percent } from "../../shared/utils/aggregations.js";
import { parseDateRange } from "../../shared/utils/dates.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const kpiService = {
  async getSummary(input: {
    role: Express.User["role"];
    startDate: string;
    endDate: string;
    refresh?: boolean;
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });
    const key = cacheKeys.kpiSummary({
      role: input.role,
      startDate: input.startDate,
      endDate: input.endDate
    });

    if (!input.refresh) {
      const cached = await cacheService.get<Record<string, unknown>>(key);
      if (cached) {
        return cached;
      }
    }

    const [totalEvents, failedEvents, csvExports, adminActions, activeUsers, averageApiLatencyMs, backgroundJobFailures] =
      await Promise.all([
        dashboardRepository.countTrackedEvents({
          occurredAt: { gte: range.startDate, lte: range.endDate }
        }),
        dashboardRepository.countTrackedEvents({
          eventType: "API_ERROR",
          occurredAt: { gte: range.startDate, lte: range.endDate }
        }),
        dashboardRepository.countTrackedEvents({
          eventType: "CSV_EXPORTED",
          occurredAt: { gte: range.startDate, lte: range.endDate }
        }),
        dashboardRepository.countTrackedEvents({
          eventType: "ADMIN_ACTION",
          occurredAt: { gte: range.startDate, lte: range.endDate }
        }),
        dashboardRepository.countDistinctActors(range.startDate, range.endDate),
        dashboardRepository.getAverageLatency(range.startDate, range.endDate),
        dashboardRepository.countTrackedEvents({
          eventType: "BACKGROUND_JOB_FAILED",
          occurredAt: { gte: range.startDate, lte: range.endDate }
        })
      ]);

    const result = applyMetricVisibility(input.role, {
      totalEvents,
      activeUsers,
      failedEvents,
      errorRate: percent(failedEvents, totalEvents),
      csvExports,
      adminActions,
      averageApiLatencyMs: Math.round(averageApiLatencyMs),
      backgroundJobFailures
    });

    await cacheService.set(key, result, 300);
    return result;
  }
};
