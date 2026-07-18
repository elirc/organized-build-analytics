import { Prisma, type MonitoringMetricType } from "@prisma/client";

import { prisma } from "../../db/prisma.js";

export const monitoringRepository = {
  async create(data: Prisma.MonitoringMetricCreateInput) {
    return prisma.monitoringMetric.create({ data });
  },

  async findMany(metricType: MonitoringMetricType, startDate: Date, endDate: Date) {
    return prisma.monitoringMetric.findMany({
      where: {
        metricType,
        recordedAt: { gte: startDate, lte: endDate }
      },
      orderBy: { recordedAt: "asc" }
    });
  },

  async aggregateAverage(metricType: MonitoringMetricType, startDate: Date, endDate: Date) {
    const result = await prisma.monitoringMetric.aggregate({
      where: {
        metricType,
        recordedAt: { gte: startDate, lte: endDate }
      },
      _avg: {
        value: true
      }
    });

    return result._avg.value ?? 0;
  },

  async getQueueDepth() {
    const [pending, processing, failed] = await Promise.all([
      prisma.exportJob.count({ where: { status: "PENDING" } }),
      prisma.exportJob.count({ where: { status: "PROCESSING" } }),
      prisma.exportJob.count({ where: { status: "FAILED" } })
    ]);

    return {
      pending,
      processing,
      failed,
      total: pending + processing + failed
    };
  },

  async getRecentJobFailures(startDate: Date, endDate: Date) {
    return prisma.trackedEvent.findMany({
      where: {
        eventType: "BACKGROUND_JOB_FAILED",
        occurredAt: { gte: startDate, lte: endDate }
      },
      orderBy: { occurredAt: "desc" },
      take: 20
    });
  }
};
