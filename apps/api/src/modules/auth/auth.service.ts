import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const getPrisma = () => {
  if (global.__prisma) return global.__prisma;
  return prisma;
};

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
import { BadRequestError, UnauthorizedError, AppError } from "../../utils/errors";
import { authSchemas, AuthInput } from "./auth.schema";
import { assertUserExists, createUser, findUserByEmail } from "./auth.repository";

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

function signAccessToken(user: { id: string; email: string; name: string }): string {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
  });
}

function signRefreshToken(user: { id: string }): string {
  return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || "7d",
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(input: AuthInput) {
  const parsed = authSchemas.register.parse(input);

  const existing = await findUserByEmail(parsed.email.toLowerCase());
  if (existing) {
    throw new AppError("User with this email already exists.", 409, "USER_EXISTS");
  }

  const passwordHash = await hashPassword(parsed.password);
  const user = await createUser({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    passwordHash: passwordHash,
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function loginUser(email: string, password: string) {
  const parsed = authSchemas.login.parse({ email, password });
  const user = await findUserByEmail(parsed.email.toLowerCase());
  if (!user || !(await comparePassword(parsed.password, user.passwordHash))) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email, name: user.name });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
  const parsed = authSchemas.refresh.parse({ refreshToken });
  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(parsed.refreshToken, process.env.JWT_REFRESH_SECRET!);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }

  const userId = typeof payload === "string" ? undefined : (payload as JwtPayload).sub;
  if (!userId) {
    throw new UnauthorizedError("Invalid refresh token payload.");
  }

  const user = await assertUserExists(userId);
  const accessToken = signAccessToken({ id: user.id, email: user.email, name: user.name });
  const newRefreshToken = signRefreshToken({ id: user.id });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function getMe(userId: string) {
  const user = await assertUserExists(userId);
  return { id: user.id, name: user.name, email: user.email };
}
