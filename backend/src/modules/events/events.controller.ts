import type { Request, Response } from "express";

import { eventsService } from "./events.service.js";

export const eventsController = {
  async track(request: Request, response: Response) {
    const result = await eventsService.track({
      ...request.body,
      occurredAt: request.body.occurredAt ? new Date(request.body.occurredAt) : undefined
    });
    response.status(201).json(result);
  },

  async list(request: Request, response: Response) {
    const result = await eventsService.list({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      eventType: request.query.eventType ? String(request.query.eventType) : undefined,
      actorId: request.query.actorId ? String(request.query.actorId) : undefined,
      entityType: request.query.entityType ? String(request.query.entityType) : undefined,
      entityId: request.query.entityId ? String(request.query.entityId) : undefined,
      search: request.query.search ? String(request.query.search) : undefined,
      page: request.query.page ? Number(request.query.page) : undefined,
      pageSize: request.query.pageSize ? Number(request.query.pageSize) : undefined
    });

    response.status(200).json(result);
  },

  async getById(request: Request, response: Response) {
    const result = await eventsService.getById(String(request.params.id));
    response.status(200).json(result);
  },

  async summaryByType(request: Request, response: Response) {
    const result = await eventsService.getSummaryByType({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async summaryOverTime(request: Request, response: Response) {
    const result = await eventsService.getSummaryOverTime({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  }
};
