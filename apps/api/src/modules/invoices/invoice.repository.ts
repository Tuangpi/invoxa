// @ts-nocheck
import { getPrisma } from "../business/business.repository";

export async function listInvoices(businessId: string) {
  const prisma = getPrisma();
  return prisma.invoice.findMany({
    where: { businessId },
    orderBy: { issueDate: "desc" },
    include: { customer: true },
  });
}

export async function getInvoice(businessId: string, invoiceId: string) {
  const prisma = getPrisma();
  return prisma.invoice.findUnique({
    where: { businessId_invoiceId: { businessId, invoiceId } },
    include: { customer: true, items: true, payments: true },
  });
}

export async function createInvoice(businessId: string, customerId: string, items: any, data: any) {
  const prisma = getPrisma();
  return prisma.invoice.create({
    data: {
      businessId,
      customerId,
      invoiceNumber: data.invoiceNumber,
      status: data.status || "DRAFT",
      currency: data.currency,
      subtotal: data.subtotal,
      discountTotal: data.discountTotal,
      taxTotal: data.taxTotal,
      total: data.total,
      amountPaid: data.amountPaid,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      customerSnapshot: data.customerSnapshot,
      items: {
        create: items,
      },
    },
    include: { customer: true, items: true },
  });
}

export async function updateInvoice(businessId: string, invoiceId: string, data: any) {
  const prisma = getPrisma();
  return prisma.invoice.update({
    where: { businessId_invoiceId: { businessId, invoiceId } },
    data: {
      status: data.status,
      currency: data.currency,
      subtotal: data.subtotal,
      discountTotal: data.discountTotal,
      taxTotal: data.taxTotal,
      total: data.total,
      amountPaid: data.amountPaid,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      customerSnapshot: data.customerSnapshot,
    },
    include: { customer: true, items: true, payments: true },
  });
}

export async function deleteInvoice(businessId: string, invoiceId: string) {
  const prisma = getPrisma();
  // Invoices can only be deleted if DRAFT status
  const invoice = await prisma.invoice.findUnique({
    where: { businessId_invoiceId: { businessId, invoiceId } },
  });
  if (invoice.status !== "DRAFT") {
    throw new Error("Only draft invoices can be deleted");
  }
  return prisma.invoice.delete({
    where: { businessId_invoiceId: { businessId, invoiceId } },
  });
}