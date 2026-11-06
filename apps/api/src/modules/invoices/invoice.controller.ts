import { Request, Response } from "express";
import {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "./invoice.service";

export async function listInvoicesHandler(req: Request, res: Response) {
  const businessId = req.params.businessId;
  const invoices = await listInvoices(businessId);
  return res.json({ success: true, data: { invoices } });
}

export async function getInvoiceHandler(req: Request, res: Response) {
  const { businessId, invoiceId } = req.params;
  const invoice = await getInvoice(businessId, invoiceId);
  return res.json({ success: true, data: { invoice } });
}

export async function createInvoiceHandler(req: Request, res: Response) {
  const { businessId, customerId, items, ...data } = req.body;
  const invoice = await createInvoice(businessId, customerId, items, data);
  return res.status(201).json({ success: true, data: { invoice } });
}

export async function updateInvoiceHandler(req: Request, res: Response) {
  const { businessId, invoiceId } = req.params;
  const invoice = await updateInvoice(businessId, invoiceId, req.body);
  return res.json({ success: true, data: { invoice } });
}

export async function deleteInvoiceHandler(req: Request, res: Response) {
  const { businessId, invoiceId } = req.params;
  await deleteInvoice(businessId, invoiceId);
  return res.json({ success: true, data: {} });
}