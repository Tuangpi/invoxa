import { Request, Response, NextFunction } from "express";

let requestId = 0;

export const requestIdMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("X-Request-Id", `req_${++requestId}_${Date.now().toString(36)}`);
  next();
};
