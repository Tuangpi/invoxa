// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { AppError, ForbiddenError } from "../../utils/errors";
import { AuthRequest, BusinessRole } from "../../middleware/auth";

export function getCustomerIdFromReq(req: Request): string | undefined {
  const params = req.params as Record<string, string | undefined>;
  if (params.id !== undefined) return params.id;
  const body = (req.body as Record<string, any> | undefined);
  if (typeof body?.id === "string") return body.id;
  const query = (req.query as Record<string, any> | undefined);
  if (typeof query?.id === "string") return query.id;
  return undefined;
}

export function requireMembershipOrAdmin(req: Request, _res: Response, next: NextFunction): void {
  const businessId =
    (req.params && req.params.businessId) ||
    (req.query && typeof req.query.businessId === "string" ? req.query.businessId : undefined) ||
    (req.body && typeof req.body.businessId === "string" ? req.body.businessId : undefined);

  if (!businessId) {
    return next(ForbiddenError("Missing businessId."));
  }

  const membership = (req as AuthRequest).membership;
  if (!membership || membership.businessId !== businessId) {
    return next(ForbiddenError("You do not have access to this business."));
  }
  next();
}


