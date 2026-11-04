import { NextFunction, Request, Response } from "express";
import { AppError, NotFoundError } from "../utils/errors";

export const notFoundHandler = (_req: Request, res: Response, next: NextFunction) => {
  next(NotFoundError("Route not found"));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    ;(res as any).status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);

  ;(res as any).status(500).json({
    success: false,
    error: { message: "Internal server error" },
  });
};
