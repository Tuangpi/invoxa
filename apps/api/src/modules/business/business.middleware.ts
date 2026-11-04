import { Request, Response, NextFunction } from "express";
import { AppError, ForbiddenError } from "../../utils/errors";
import { AuthRequest, BusinessRole } from "../../middleware/auth";

export function getBusinessIdFromReq(req: Request): string | undefined {
  const params = req.params as Record<string, string | undefined>;
  if (params.businessId !== undefined) return params.businessId;
  const body = (req.body as Record<string, any> | undefined);
  if (typeof body?.businessId === "string") return body.businessId;
  const query = (req.query as Record<string, any> | undefined);
  if (typeof query?.businessId === "string") return query.businessId;
  return undefined;
}

export function requireMembershipOrAdmin(req: Request, _res: Response, next: NextFunction): void {
  const businessId = getBusinessIdFromReq(req);
  if (!businessId) {
    return next(ForbiddenError("Missing businessId."));
  }

  const membership = (req as AuthRequest).membership;
  if (!membership || membership.businessId !== businessId) {
    return next(ForbiddenError("You do not have access to this business."));
  }
  next();
}

function canManageMembers(role?: BusinessRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}

export const requireOwnerOrAdmin = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!canManageMembers(req.membership?.role)) {
    return next(ForbiddenError("Only owners and admins can perform this action."));
  }
  next();
};

export const requireOwner = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (req.membership?.role !== "OWNER") {
    return next(ForbiddenError("Only the owner can perform this action."));
  }
  next();
};
