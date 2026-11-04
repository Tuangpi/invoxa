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
import { AppError, NotFoundError } from "../../utils/errors";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findByUserId = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: { name: string; email: string; passwordHash: string }) => {
  return prisma.user.create({ data });
};

export const assertUserExists = async (id: string) => {
  const user = await findByUserId(id);
  if (!user) {
    throw NotFoundError("User not found.");
  }
  return user;
};
