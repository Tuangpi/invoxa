import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors";
import { AuthRequest, BusinessRole } from "../middleware/auth";

export function requireBusinessAccess(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const businessId =
    (req.params && req.params.businessId) ||
    (req.body && typeof req.body.businessId === "string" ? req.body.businessId : undefined) ||
    (req.query && typeof req.query.businessId === "string" ? req.query.businessId : undefined);

  if (!businessId) {
    return next(ForbiddenError("Missing businessId"));
  }

  const membership = req as AuthRequest & { membership?: { businessId: string; role: BusinessRole } };
  if (!membership.membership || membership.membership.businessId !== businessId) {
    return next(ForbiddenError("You do not have access to this business"));
  }

  (req as AuthRequest).membership = membership.membership;
  next();
}
