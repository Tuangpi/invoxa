// @ts-nocheck
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

export const createSubscription = async (
  businessId: string,
  data: {
    planId: string;
    status?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  }
) => {
  return prisma.$transaction(async (tx: Parameters<typeof prisma.$transaction>[1]) => {
    const subscription = await tx.subscription.create({
      data: {
        businessId,
        planId: data.planId,
        status: data.status || "TRIALING",
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      },
    });
    return subscription;
  });
};

export const getSubscriptionsByBusiness = async (businessId: string) => {
  return prisma.subscription.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });
};

export const getSubscriptionById = async (subscriptionId: string, businessId: string) => {
  return prisma.subscription.findFirst({
    where: { id: subscriptionId, businessId },
  });
};

export const updateSubscription = async (
  subscriptionId: string,
  businessId: string,
  data: { status?: string }
) => {
  return prisma.subscription.update({
    where: { id: subscriptionId, businessId },
    data,
  });
};

export const cancelSubscription = async (subscriptionId: string, businessId: string) => {
  return prisma.subscription.update({
    where: { id: subscriptionId, businessId },
    data: { status: "CANCELED" },
  });
};

export const endTrialSubscription = async (
  subscriptionId: string,
  businessId: string
) => {
  return prisma.subscription.update({
    where: { id: subscriptionId, businessId },
    data: { status: "ACTIVE" },
  });
};