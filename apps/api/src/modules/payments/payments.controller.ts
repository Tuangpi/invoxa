// @ts-nocheck
import { Request, Response } from "express";
import {
  listPaymentsService,
  getPaymentService,
  createPaymentService,
  reversePaymentService,
} from "./payments.service";

export async function listPaymentsHandler(req: Request, res: Response) {
  try {
    const businessId = req.params.businessId;
    const payments = await listPaymentsService(businessId);
    res.json({ success: true, data: { payments } });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getPaymentHandler(req: Request, res: Response) {
  try {
    const { businessId, paymentId } = req.params;
    const payment = await getPaymentService(businessId, paymentId);
    res.json({ success: true, data: { payment } });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}

export async function createPaymentHandler(req: Request, res: Response) {
  try {
    const { invoiceId, amount, currency, method, reference } = req.body;
    const businessId = req.params.businessId;

    const payment = await createPaymentService({
      businessId,
      invoiceId,
      amount,
      currency,
      method,
      reference,
    });

    res.status(201).json({ success: true, data: { payment } });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function reversePaymentHandler(req: Request, res: Response) {
  try {
    const { paymentId } = req.params;
    const businessId = req.params.businessId;

    const payment = await reversePaymentService(businessId, paymentId);
    res.json({ success: true, data: { payment } });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}