import { MonitoringMetricType } from "@prisma/client";
import type { Request, Response } from "express";

import { monitoringService } from "./monitoring.service.js";

export const monitoringController = {
  async record(request: Request, response: Response) {
    const result = await monitoringService.record({
      ...request.body,
      recordedAt: request.body.recordedAt ? new Date(request.body.recordedAt) : undefined
    });
    response.status(201).json(result);
  },

  async summary(request: Request, response: Response) {
    const result = await monitoringService.getSummary({
      role: request.user!.role,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async apiLatency(request: Request, response: Response) {
    const result = await monitoringService.getSeries({
      metricType: MonitoringMetricType.API_LATENCY,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async errorRate(request: Request, response: Response) {
    const result = await monitoringService.getSeries({
      metricType: MonitoringMetricType.ERROR_RATE,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async jobFailures(request: Request, response: Response) {
    const result = await monitoringService.getSeries({
      metricType: MonitoringMetricType.JOB_FAILURE_RATE,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async cacheHitRate(request: Request, response: Response) {
    const result = await monitoringService.getSeries({
      metricType: MonitoringMetricType.CACHE_HIT_RATE,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async dbQueryTime(request: Request, response: Response) {
    const result = await monitoringService.getSeries({
      metricType: MonitoringMetricType.DB_QUERY_TIME,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async queueDepth(_request: Request, response: Response) {
    const result = await monitoringService.getQueueDepth();
    response.status(200).json(result);
  },

  async recentJobFailures(request: Request, response: Response) {
    const result = await monitoringService.getRecentJobFailures({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  }
};
