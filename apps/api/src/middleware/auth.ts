import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
  membership?: { role: BusinessRole; businessId: string };
}

export type BusinessRole = "OWNER" | "ADMIN" | "STAFF" | "VIEWER";

export const rolePriority: Record<BusinessRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  STAFF: 2,
  VIEWER: 1,
};
