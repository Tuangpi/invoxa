// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "../business/business.middleware";
import {
  listExpensesHandler,
  getExpenseHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
  listExpenseCategoriesHandler,
  createExpenseCategoryHandler,
  updateExpenseCategoryHandler,
  deleteExpenseCategoryHandler,
} from "./expenses.controller";

const router = Router();

// All expense routes require authentication and business membership
router.use(requireAuth);

// Expense routes are per-business, so require membership
router.use(requireMembershipOrAdmin);

router.get("/expenses", listExpensesHandler);
router.get("/expenses/:expenseId", getExpenseHandler);
router.post("/expenses", createExpenseHandler);
router.patch("/expenses/:expenseId", updateExpenseHandler);
router.delete("/expenses/:expenseId", deleteExpenseHandler);

router.get("/expense-categories", listExpenseCategoriesHandler);
router.post("/expense-categories", createExpenseCategoryHandler);
router.patch("/expense-categories/:categoryId", updateExpenseCategoryHandler);
router.delete("/expense-categories/:categoryId", deleteExpenseCategoryHandler);

export default router;
export { router as expensesRouter };