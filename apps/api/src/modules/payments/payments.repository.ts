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

export const listPayments = async (businessId: string) => {
  return prisma.payment.findMany({
    where: { businessId },
    orderBy: { paidAt: "desc" },
    include: { invoice: true },
  });
};

export const getPayment = async (businessId: string, paymentId: string) => {
  return prisma.payment.findUnique({
    where: { businessId_paymentId: { businessId, paymentId } },
    include: { invoice: true },
  });
};

export const createPayment = async (data: {
  businessId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: string;
  reference?: string;
}) => {
  // Verify invoice belongs to same business
  const invoice = await prisma.invoice.findUnique({
    where: { businessId_invoiceId: { businessId: data.businessId, invoiceId: data.invoiceId } },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.businessId !== data.businessId) {
    throw new Error("Invoice does not belong to this business");
  }

  // Check that payment amount does not exceed outstanding balance
  const outstandingBalance = invoice.total - (invoice.amountPaid || 0);

  if (data.amount > outstandingBalance) {
    throw new Error(
      `Payment amount exceeds outstanding balance of ${outstandingBalance}`
    );
  }

  return prisma.payment.create({
    data: {
      businessId: data.businessId,
      invoiceId: data.invoiceId,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      reference: data.reference,
      paidAt: new Date(),
    },
    include: { invoice: true },
  });
};

export const reversePayment = async (businessId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { businessId_paymentId: { businessId, paymentId } },
    include: { invoice: true },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.invoice.status === "DRAFT" || payment.invoice.status === "VOID") {
    throw new Error("Cannot reverse payment for draft or void invoice");
  }

  // Soft-reverse by clearing paidAt
  return prisma.payment.update({
    where: { businessId_paymentId: { businessId, paymentId } },
    data: {
      paidAt: null,
    },
    include: { invoice: true },
  });
};