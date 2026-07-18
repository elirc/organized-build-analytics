import type { Request, Response } from "express";

import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  async kpiSummary(request: Request, response: Response) {
    const result = await dashboardService.getKpiSummary({
      role: request.user!.role,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      refresh: request.query.refresh === "true"
    });

    response.status(200).json(result);
  },

  async eventsOverTime(request: Request, response: Response) {
    const result = await dashboardService.getEventsOverTime({
      role: request.user!.role,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      interval: request.query.interval === "week" ? "week" : request.query.interval === "day" ? "day" : undefined,
      refresh: request.query.refresh === "true"
    });

    response.status(200).json(result);
  },

  async eventsByType(request: Request, response: Response) {
    const result = await dashboardService.getEventsByType({
      role: request.user!.role,
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      refresh: request.query.refresh === "true"
    });

    response.status(200).json(result);
  },

  async recentActivity(request: Request, response: Response) {
    const result = await dashboardService.getRecentActivity({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async activeUsers(request: Request, response: Response) {
    const result = await dashboardService.getActiveUsers({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      interval: request.query.interval === "week" ? "week" : "day"
    });

    response.status(200).json(result);
  },

  async errorRate(request: Request, response: Response) {
    const result = await dashboardService.getErrorRate({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      interval: request.query.interval === "week" ? "week" : "day"
    });

    response.status(200).json(result);
  },

  async conversionFunnel(request: Request, response: Response) {
    const result = await dashboardService.getConversionFunnel({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  }
};
