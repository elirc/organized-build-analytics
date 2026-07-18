import { Prisma, type EventType } from "@prisma/client";

import { prisma } from "../../db/prisma.js";
import { getPagination } from "../../shared/utils/pagination.js";

interface EventFilters {
  startDate: Date;
  endDate: Date;
  eventType?: string;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const eventsRepository = {
  async create(data: Prisma.TrackedEventCreateInput) {
    return prisma.trackedEvent.create({ data });
  },

  async findMany(filters: EventFilters) {
    const pagination = getPagination(filters);

    const where: Prisma.TrackedEventWhereInput = {
      occurredAt: {
        gte: filters.startDate,
        lte: filters.endDate
      },
      eventType: filters.eventType as EventType | undefined,
      actorId: filters.actorId,
      entityType: filters.entityType,
      entityId: filters.entityId,
      OR: filters.search
        ? [
            { actorEmail: { contains: filters.search, mode: "insensitive" } },
            { entityType: { contains: filters.search, mode: "insensitive" } }
          ]
        : undefined
    };

    const [items, total] = await Promise.all([
      prisma.trackedEvent.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { occurredAt: "desc" }
      }),
      prisma.trackedEvent.count({ where })
    ]);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  },

  async findById(id: string) {
    return prisma.trackedEvent.findUnique({ where: { id } });
  }
};
