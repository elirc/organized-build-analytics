import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodError } from "zod";

import { AppError } from "../shared/errors/AppError.js";
import { ERROR_CODES } from "../shared/errors/errorCodes.js";

export function validate(schema: AnyZodObject) {
  return (request: Request, _response: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: request.body,
        query: request.query,
        params: request.params
      });
      return next();
    } catch (error) {
      const zodError = error as ZodError;
      return next(
        new AppError(
          ERROR_CODES.BAD_REQUEST,
          zodError.issues[0]?.message ?? "Validation failed",
          400
        )
      );
    }
  };
}
