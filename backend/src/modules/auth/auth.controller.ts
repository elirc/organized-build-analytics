import type { Request, Response } from "express";

import { authService } from "./auth.service.js";

export const authController = {
  async register(request: Request, response: Response) {
    const result = await authService.register(request.body);
    response.status(201).json(result);
  },

  async login(request: Request, response: Response) {
    const result = await authService.login(request.body);
    response.status(200).json(result);
  },

  async me(request: Request, response: Response) {
    if (!request.user) {
      response.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required"
        }
      });
      return;
    }

    const result = await authService.getCurrentUser(request.user!.id);
    response.status(200).json(result);
  },

  async refresh(request: Request, response: Response) {
    const result = await authService.refresh(request.body.refreshToken);
    response.status(200).json(result);
  },

  async logout(request: Request, response: Response) {
    await authService.logout(request.body.refreshToken);
    response.status(204).send();
  }
};
