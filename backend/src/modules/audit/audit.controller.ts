import type { Request, Response } from "express";

import { auditService } from "./audit.service.js";

export const auditController = {
  async list(request: Request, response: Response) {
    const result = await auditService.list({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate),
      action: request.query.action ? String(request.query.action) : undefined,
      actorId: request.query.actorId ? String(request.query.actorId) : undefined,
      entityType: request.query.entityType ? String(request.query.entityType) : undefined,
      page: request.query.page ? Number(request.query.page) : undefined,
      pageSize: request.query.pageSize ? Number(request.query.pageSize) : undefined
    });

    response.status(200).json(result);
  },

  async getById(request: Request, response: Response) {
    const result = await auditService.getById(String(request.params.id));
    response.status(200).json(result);
  },

  async summaryByAction(request: Request, response: Response) {
    const result = await auditService.summaryByAction({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async summaryByActor(request: Request, response: Response) {
    const result = await auditService.summaryByActor({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  },

  async summaryOverTime(request: Request, response: Response) {
    const result = await auditService.summaryOverTime({
      startDate: String(request.query.startDate),
      endDate: String(request.query.endDate)
    });

    response.status(200).json(result);
  }
};
