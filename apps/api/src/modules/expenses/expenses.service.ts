// @ts-nocheck
import { NotFoundError } from "../../utils/errors";
import { prisma } from "./expenses.repository";
import { listExpenses, getExpense, createExpense, updateExpense, deleteExpense, listExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from "./expenses.repository";

export async function listExpensesService(businessId: string) {
  return listExpenses(businessId);
}

export async function getExpenseService(businessId: string, expenseId: string) {
  const expense = await getExpense(businessId, expenseId);
  if (!expense) {
    throw NotFoundError("Expense not found");
  }
  return expense;
}

export async function createExpenseService(data: {
  businessId: string;
  categoryId?: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  receiptFileId?: string;
}) {
  return createExpense(data);
}

export async function updateExpenseService(businessId: string, expenseId: string, data: {
  categoryId?: string;
  description?: string;
  amount?: number;
  currency?: string;
  expenseDate?: Date;
  receiptFileId?: string;
}) {
  const expense = await getExpense(businessId, expenseId);
  if (!expense) {
    throw NotFoundError("Expense not found");
  }
  return updateExpense(businessId, expenseId, data);
}

export async function deleteExpenseService(businessId: string, expenseId: string) {
  const expense = await getExpense(businessId, expenseId);
  if (!expense) {
    throw NotFoundError("Expense not found");
  }
  return deleteExpense(businessId, expenseId);
}

export async function listExpenseCategoriesService(businessId: string) {
  return listExpenseCategories(businessId);
}

export async function createExpenseCategoryService(data: {
  businessId: string;
  name: string;
}) {
  return createExpenseCategory(data);
}

export async function updateExpenseCategoryService(businessId: string, categoryId: string, data: {
  name?: string;
}) {
  return updateExpenseCategory(businessId, categoryId, data);
}

export async function deleteExpenseCategoryService(businessId: string, categoryId: string) {
  return deleteExpenseCategory(businessId, categoryId);
}