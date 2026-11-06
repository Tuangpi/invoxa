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

export const listExpenses = async (businessId: string) => {
  return prisma.expense.findMany({
    where: { businessId },
    orderBy: { expenseDate: "desc" },
    include: { category: true, business: true },
  });
};

export const getExpense = async (businessId: string, expenseId: string) => {
  return prisma.expense.findUnique({
    where: { businessId_expenseId: { businessId, expenseId } },
    include: { category: true, business: true },
  });
};

export const createExpense = async (data: {
  businessId: string;
  categoryId?: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  receiptFileId?: string;
}) => {
  // Verify business exists
  const business = await prisma.business.findUnique({
    where: { id: data.businessId },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  return prisma.expense.create({
    data: {
      businessId: data.businessId,
      categoryId: data.categoryId,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      expenseDate: data.expenseDate,
      receiptFileId: data.receiptFileId,
    },
    include: { category: true, business: true },
  });
};

export const updateExpense = async (businessId: string, expenseId: string, data: {
  categoryId?: string;
  description?: string;
  amount?: number;
  currency?: string;
  expenseDate?: Date;
  receiptFileId?: string;
}) => {
  return prisma.expense.update({
    where: { businessId_expenseId: { businessId, expenseId } },
    data,
    include: { category: true, business: true },
  });
};

export const deleteExpense = async (businessId: string, expenseId: string) => {
  return prisma.expense.delete({
    where: { businessId_expenseId: { businessId, expenseId } },
  });
};

export const listExpenseCategories = async (businessId: string) => {
  return prisma.expenseCategory.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });
};

export const createExpenseCategory = async (data: {
  businessId: string;
  name: string;
}) => {
  // Check for duplicate name within business
  const existing = await prisma.expenseCategory.findUnique({
    where: { businessId_name: { businessId, name: data.name } },
  });

  if (existing) {
    throw new Error("Expense category name must be unique within a business");
  }

  return prisma.expenseCategory.create({
    data: {
      businessId: data.businessId,
      name: data.name,
    },
  });
};

export const updateExpenseCategory = async (businessId: string, categoryId: string, data: {
  name?: string;
}) => {
  return prisma.expenseCategory.update({
    where: { id: categoryId },
    data: {
      name: data.name,
    },
  });
};

export const deleteExpenseCategory = async (businessId: string, categoryId: string) => {
  // Check if category has expenses
  const count = await prisma.expense.count({
    where: { categoryId, businessId },
  });

  if (count > 0) {
    throw new Error("Cannot delete category that has expenses");
  }

  return prisma.expenseCategory.delete({
    where: { id: categoryId },
  });
};