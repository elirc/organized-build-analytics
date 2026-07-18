import type { Request, Response } from "express";

import { usersService } from "./users.service.js";

export const usersController = {
  async list(request: Request, response: Response) {
    const result = await usersService.list({
      page: Number(request.query.page),
      pageSize: Number(request.query.pageSize)
    });

    response.status(200).json(result);
  }
};
