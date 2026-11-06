// @ts-nocheck
import { NotFoundError } from "../../utils/errors";
import { listPayments, getPayment, createPayment, reversePayment } from "./payments.repository";

export async function listPaymentsService(businessId: string) {
  return listPayments(businessId);
}

export async function getPaymentService(businessId: string, paymentId: string) {
  const payment = await getPayment(businessId, paymentId);
  if (!payment) {
    throw NotFoundError("Payment not found");
  }
  return payment;
}

export async function createPaymentService(data: {
  businessId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: string;
  reference?: string;
}) {
  return createPayment(data);
}

export async function reversePaymentService(businessId: string, paymentId: string) {
  const payment = await reversePayment(businessId, paymentId);
  if (!payment) {
    throw NotFoundError("Payment not found");
  }
  return payment;
}