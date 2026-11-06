import express from "express";
import authRouter from "./modules/auth/auth.routes";
import businessRouter from "./modules/business/business.routes";
import { customersRouter } from "./modules/customers/customer.routes";
import { invoicesRouter } from "./modules/invoices/invoice.routes";
import { paymentsRouter } from "./modules/payments/payments.routes";
import { expensesRouter } from "./modules/expenses/expenses.routes";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/businesses", businessRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/invoices", invoicesRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/expenses", expensesRouter);

export default app;

