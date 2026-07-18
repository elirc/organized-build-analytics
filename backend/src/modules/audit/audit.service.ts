import { Prisma } from "@prisma/client";

import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES } from "../../shared/errors/errorCodes.js";
import { parseDateRange, toIsoDate } from "../../shared/utils/dates.js";
import { auditRepository } from "./audit.repository.js";

export const auditService = {
  async record(input: {
    actorId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return auditRepository.create({
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent
    });
  },

  async list(input: {
    startDate: string;
    endDate: string;
    action?: string;
    actorId?: string;
    entityType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const range = parseDateRange(input.startDate, input.endDate);
    return auditRepository.list({ ...input, ...range });
  },

  async getById(id: string) {
    const item = await auditRepository.findById(id);

    if (!item) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "Audit event not found", 404);
    }

    return item;
  },

  async summaryByAction(input: { startDate: string; endDate: string }) {
    const data = await this.list({ ...input, pageSize: 10_000 });

    const grouped = data.items.reduce<Record<string, number>>((accumulator, event) => {
      accumulator[event.action] = (accumulator[event.action] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([action, count]) => ({ action, count }));
  },

  async summaryByActor(input: { startDate: string; endDate: string }) {
    const data = await this.list({ ...input, pageSize: 10_000 });

    const grouped = data.items.reduce<Record<string, number>>((accumulator, event) => {
      const key = event.actor?.email ?? "unknown";
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([actor, count]) => ({ actor, count }));
  },

  async summaryOverTime(input: { startDate: string; endDate: string }) {
    const data = await this.list({ ...input, pageSize: 10_000 });

    const grouped = data.items.reduce<Record<string, number>>((accumulator, event) => {
      const key = toIsoDate(event.createdAt);
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, count]) => ({ date, count }));
  }
};
