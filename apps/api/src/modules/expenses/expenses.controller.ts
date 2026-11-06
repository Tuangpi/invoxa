// @ts-nocheck
import { Request, Response } from "express";
import {
  listExpensesService,
  getExpenseService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
  listExpenseCategoriesService,
  createExpenseCategoryService,
  updateExpenseCategoryService,
  deleteExpenseCategoryService,
} from "./expenses.service";

export async function listExpensesHandler(req: Request, res: Response) {
  try {
    const businessId = req.params.businessId;
    const expenses = await listExpensesService(businessId);
    res.json({ success: true, data: { expenses } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getExpenseHandler(req: Request, res: Response) {
  try {
    const { businessId, expenseId } = req.params;
    const expense = await getExpenseService(businessId, expenseId);
    res.json({ success: true, data: { expense } });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}

export async function createExpenseHandler(req: Request, res: Response) {
  try {
    const { categoryId, description, amount, currency, expenseDate, receiptFileId } = req.body;
    const businessId = req.params.businessId;

    const expense = await createExpenseService({
      businessId,
      categoryId,
      description,
      amount,
      currency,
      expenseDate: new Date(expenseDate),
      receiptFileId,
    });

    res.status(201).json({ success: true, data: { expense } });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function updateExpenseHandler(req: Request, res: Response) {
  try {
    const { expenseId } = req.params;
    const { categoryId, description, amount, currency, expenseDate, receiptFileId } = req.body;
    const businessId = req.params.businessId;

    const expense = await updateExpenseService(businessId, expenseId, {
      categoryId,
      description,
      amount,
      currency,
      expenseDate: expenseDate ? new Date(expenseDate) : undefined,
      receiptFileId,
    });

    res.json({ success: true, data: { expense } });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteExpenseHandler(req: Request, res: Response) {
  try {
    const { expenseId } = req.params;
    const businessId = req.params.businessId;

    await deleteExpenseService(businessId, expenseId);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function listExpenseCategoriesHandler(req: Request, res: Response) {
  try {
    const businessId = req.params.businessId;
    const categories = await listExpenseCategoriesService(businessId);
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createExpenseCategoryHandler(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const businessId = req.params.businessId;

    const category = await createExpenseCategoryService({
      businessId,
      name,
    });

    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function updateExpenseCategoryHandler(req: Request, res: Response) {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const businessId = req.params.businessId;

    const category = await updateExpenseCategoryService(businessId, categoryId, {
      name,
    });

    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteExpenseCategoryHandler(req: Request, res: Response) {
  try {
    const { categoryId } = req.params;
    const businessId = req.params.businessId;

    await deleteExpenseCategoryService(businessId, categoryId);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}