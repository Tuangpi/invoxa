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

export const createPlan = async (businessId: string, data: { name: string; price: string; billingInterval?: "monthly" | "yearly"; limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; } }) => {
  return prisma.$transaction(async (tx: Parameters<typeof prisma.$transaction>[1]) => {
    const plan = await tx.plan.create({
      data: {
        name: data.name,
        price: data.price,
        billingInterval: data.billingInterval,
        limits: data.limits,
        business: { connect: { id: businessId } },
      },
    });
    return plan;
  });
};

export const getPlansByBusiness = async (businessId: string) => {
  return prisma.plan.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });
};

export const getPlanById = async (planId: string, businessId: string) => {
  return prisma.plan.findFirst({
    where: { id: planId, businessId },
  });
};

export const updatePlan = async (planId: string, businessId: string, data: { name?: string; price?: string; billingInterval?: "monthly" | "yearly"; limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; } }) => {
  return prisma.plan.update({
    where: { id: planId, businessId },
    data,
  });
};

export const deletePlan = async (planId: string, businessId: string) => {
  // Check if any subscriptions exist for this plan
  const subscriptions = await prisma.subscription.count({
    where: { planId: planId },
  });
  if (subscriptions > 0) {
    throw new Error("Cannot delete plan that has active subscriptions");
  }
  return prisma.plan.delete({
    where: { id: planId, businessId },
  });
};