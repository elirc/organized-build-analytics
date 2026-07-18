import type { Request, Response } from "express";

import { auditService } from "../audit/audit.service.js";
import { dashboardConfigsService } from "./dashboardConfigs.service.js";

export const dashboardConfigsController = {
  async list(_request: Request, response: Response) {
    const result = await dashboardConfigsService.list();
    response.status(200).json(result);
  },

  async create(request: Request, response: Response) {
    const result = await dashboardConfigsService.create(request.body);

    await auditService.record({
      actorId: request.user?.id,
      action: "DASHBOARD_CONFIG_CREATED",
      entityType: "DashboardConfig",
      entityId: result.id,
      metadata: {
        role: result.role
      }
    });

    response.status(201).json(result);
  },

  async getById(request: Request, response: Response) {
    const result = await dashboardConfigsService.getById(String(request.params.id));
    response.status(200).json(result);
  },

  async patch(request: Request, response: Response) {
    const result = await dashboardConfigsService.update(String(request.params.id), request.body);

    await auditService.record({
      actorId: request.user?.id,
      action: "DASHBOARD_CONFIG_UPDATED",
      entityType: "DashboardConfig",
      entityId: result.id,
      metadata: {
        role: result.role
      }
    });

    response.status(200).json(result);
  },

  async remove(request: Request, response: Response) {
    await auditService.record({
      actorId: request.user?.id,
      action: "DASHBOARD_CONFIG_DELETED",
      entityType: "DashboardConfig",
      entityId: String(request.params.id)
    });

    await dashboardConfigsService.remove(String(request.params.id));
    response.status(204).send();
  }
};
