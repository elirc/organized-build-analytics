import type { Request, Response } from "express";
import { createReadStream } from "node:fs";

import { exportsService } from "./exports.service.js";

export const exportsController = {
  async create(request: Request, response: Response) {
    const result = await exportsService.create({
      requestedById: request.user!.id,
      requestedByRole: request.user!.role,
      exportType: request.body.exportType,
      filters: request.body.filters
    });

    response.status(201).json(result);
  },

  async list(request: Request, response: Response) {
    const result = await exportsService.listForUser(request.user!.id);
    response.status(200).json(result);
  },

  async getById(request: Request, response: Response) {
    const result = await exportsService.getById(request.user!.id, String(request.params.id));
    response.status(200).json(result);
  },

  async retry(request: Request, response: Response) {
    const result = await exportsService.retry(
      request.user!.id,
      String(request.params.id),
      request.user!.role
    );
    response.status(200).json(result);
  },

  async download(request: Request, response: Response) {
    const file = await exportsService.downloadForUser(request.user!.id, String(request.params.id));
    response.setHeader("content-type", "text/csv; charset=utf-8");
    response.setHeader("content-disposition", `attachment; filename="${file.fileName}"`);

    createReadStream(file.filePath).pipe(response);
  }
};
