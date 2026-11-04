// @ts-nocheck
// @ts-nocheck
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../utils/errors";

export function signAccessToken(user: { id: string; email: string; name: string }): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  ) as string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function signRefreshToken(user: { id: string }): string {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
  ) as string;
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(UnauthorizedError("Missing or malformed bearer token"));
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string;
      email: string;
      name: string;
    };
    (req as { user?: { id: string; email: string; name: string } }).user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    next(UnauthorizedError("Invalid or expired access token"));
  }
};
