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

// Business analytics and revenue summary
export const getBusinessAnalytics = async (businessId: string) => {
  const business = await prisma.business.findFirst({
    where: { id: businessId },
    include: {
      members: true,
      subscriptions: {
        include: {
          plan: true,
        },
      },
      invoices: {
        include: {
          invoiceItems: true,
        },
        orderBy: { createdAt: "desc" },
      },
      expenses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!business) {
    throw new Error("Business not found.");
  }

  // Calculate total revenue from paid invoices
  const totalRevenue = business.invoices
    .filter((inv: any) => inv.status === "PAID")
    .reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);

  // Calculate total expenses
  const totalExpenses = business.expenses.reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0
  );

  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;

  // Subscription status breakdown
  const subscriptionStatus = {
    active: business.subscriptions.filter(
      (sub: any) => sub.status === "ACTIVE"
    ).length,
    trialing: business.subscriptions.filter(
      (sub: any) => sub.status === "TRIALING"
    ).length,
    past_due: business.subscriptions.filter(
      (sub: any) => sub.status === "PAST_DUE"
    ).length,
    canceled: business.subscriptions.filter(
      (sub: any) => sub.status === "CANCELED"
    ).length,
  };

  // Revenue by billing interval
  const revenueByInterval = business.subscriptions.reduce(
    (acc: any, sub: any) => {
      if (sub.plan?.billingInterval === "monthly") {
        acc.monthly += sub.plan?.price || 0;
      } else if (sub.plan?.billingInterval === "yearly") {
        acc.yearly += sub.plan?.price || 0;
      }
      return acc;
    },
    { monthly: 0, yearly: 0 }
  );

  // Active customers count (unique businesses with active subscriptions)
  const activeCustomers = new Set(
    business.subscriptions
      .filter((sub: any) => sub.status === "ACTIVE")
      .map((sub: any) => sub.businessId)
  ).size;

  return {
    success: true,
    data: {
      totalRevenue,
      totalExpenses,
      netProfit,
      subscriptionStatus,
      revenueByInterval,
      activeCustomers,
      memberCount: business.members.length,
    },
  };
};

// Get all business members
export const getBusinessMembers = async (businessId: string) => {
  const members = await prisma.businessMember.findMany({
    where: { businessId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { role: "asc", joinedAt: "desc" },
  });

  return {
    success: true,
    data: { members },
  };
};

// Get all subscriptions across business (admin view)
export const getAllBusinessSubscriptions = async (businessId: string) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { businessId },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          price: true,
          billingInterval: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: { subscriptions },
  };
};

// Update plan limits (owner only)
export const updatePlanLimits = async (
  planId: string,
  businessId: string,
  data: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number }
) => {
  const plan = await prisma.plan.update({
    where: { id: planId, businessId },
    data: {
      limits: data,
    },
  });

  return {
    success: true,
    data: { plan },
  };
};