import { z } from "zod";

const base = {
  customerId: z.string().uuid("Invalid customer ID"),
  status: z.enum(["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"]),
  currency: z.string().length(3, "Currency must be a 3-letter ISO code"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  discountTotal: z.number().min(0, "Discount total must be positive"),
  taxTotal: z.number().min(0, "Tax total must be positive"),
  total: z.number(),
  amountPaid: z.number().min(0, "Amount paid must be positive"),
  issueDate: z.date(),
  dueDate: z.date().optional(),
};

export const invoiceSchemas = {
  create: z.object({
    ...base,
    items: z.array(
      z.object({
        productId: z.string().uuid("Invalid product ID").optional(),
        description: z.string().min(1, "Description is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitPrice: z.number().min(0, "Unit price must be positive"),
        discount: z.number().min(0, "Discount must be positive"),
        taxRate: z.number().default(0),
      }),
    ),
  }),
  patch: z.object({
    status: z.enum(["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"]).optional(),
    currency: z.string().length(3).optional(),
    subtotal: z.number().min(0).optional(),
    discountTotal: z.number().min(0).optional(),
    taxTotal: z.number().min(0).optional(),
    total: z.number().optional(),
    amountPaid: z.number().min(0).optional(),
    dueDate: z.date().optional(),
  }),
};

export type InvoiceCreateInput = z.infer<typeof invoiceSchemas.create>;
export type InvoicePatchInput = z.infer<typeof invoiceSchemas.patch>;