import { cacheKeys } from "../../cache/cacheKeys.js";
import { cacheService } from "../../cache/cache.service.js";
import { parseDateRange } from "../../shared/utils/dates.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const chartDataService = {
  async getEventsOverTime(input: {
    role: Express.User["role"];
    startDate: string;
    endDate: string;
    interval?: "day" | "week";
    refresh?: boolean;
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });
    const key = cacheKeys.eventsOverTime({
      role: input.role,
      startDate: input.startDate,
      endDate: input.endDate,
      interval: input.interval
    });

    if (!input.refresh) {
      const cached = await cacheService.get<{ interval: string; data: { date: string; count: number }[] }>(key);
      if (cached) {
        return cached;
      }
    }

    const result = {
      interval: input.interval ?? "day",
      data: await dashboardRepository.getEventsOverTime(
        range.startDate,
        range.endDate,
        input.interval ?? "day"
      )
    };

    await cacheService.set(key, result, 300);
    return result;
  },

  async getEventsByType(input: {
    role: Express.User["role"];
    startDate: string;
    endDate: string;
    refresh?: boolean;
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });
    const key = cacheKeys.eventsByType({
      role: input.role,
      startDate: input.startDate,
      endDate: input.endDate
    });

    if (!input.refresh) {
      const cached = await cacheService.get<unknown[]>(key);
      if (cached) {
        return cached;
      }
    }

    const result = await dashboardRepository.getEventsByType(range.startDate, range.endDate);
    await cacheService.set(key, result, 300);
    return result;
  },

  async getActiveUsers(input: {
    startDate: string;
    endDate: string;
    interval?: "day" | "week";
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });

    return dashboardRepository.getActiveUsersOverTime(
      range.startDate,
      range.endDate,
      input.interval ?? "day"
    );
  },

  async getErrorRate(input: {
    startDate: string;
    endDate: string;
    interval?: "day" | "week";
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });

    return dashboardRepository.getErrorRateOverTime(
      range.startDate,
      range.endDate,
      input.interval ?? "day"
    );
  },

  async getConversionFunnel(input: {
    startDate: string;
    endDate: string;
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });
    return dashboardRepository.getConversionFunnel(range.startDate, range.endDate);
  }
};
