import { EventType, type Prisma } from "@prisma/client";

import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES } from "../../shared/errors/errorCodes.js";
import { parseDateRange, toIsoDate } from "../../shared/utils/dates.js";
import { eventsRepository } from "./events.repository.js";

export const eventsService = {
  async track(data: Prisma.TrackedEventCreateInput) {
    return eventsRepository.create(data);
  },

  async list(filters: {
    startDate: string;
    endDate: string;
    eventType?: string;
    actorId?: string;
    entityType?: string;
    entityId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const range = parseDateRange(filters.startDate, filters.endDate);
    return eventsRepository.findMany({ ...filters, ...range });
  },

  async getById(id: string) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "Tracked event not found", 404);
    }

    return event;
  },

  async getSummaryByType(filters: { startDate: string; endDate: string }) {
    const { startDate, endDate } = parseDateRange(filters.startDate, filters.endDate);

    const counts = await Promise.all(
      Object.values(EventType).map(async (eventType) => ({
        eventType,
        count: await eventsRepository.findMany({
          startDate,
          endDate,
          eventType
        }).then((result) => result.total)
      }))
    );

    return counts;
  },

  async getSummaryOverTime(filters: { startDate: string; endDate: string }) {
    const { startDate, endDate } = parseDateRange(filters.startDate, filters.endDate);
    const data = await eventsRepository.findMany({ startDate, endDate, pageSize: 10_000 });

    const grouped = data.items.reduce<Record<string, number>>((accumulator, event) => {
      const key = toIsoDate(event.occurredAt);
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, count]) => ({ date, count }));
  }
};
