export const SHARED_VERSION = "0.1.0";
import { z } from "zod";

export interface PlanCreateInput {
  name: string;
  price: string;
  billingInterval?: "monthly" | "yearly" | null;
  limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; };
}

export interface PlanUpdateInput {
  name?: string;
  price?: string;
  billingInterval?: "monthly" | "yearly" | null;
  limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; };
}

export const planCreateSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.string().regex(/^\d+(\.\d{1,4})?$/),
  billingInterval: z.enum(["monthly", "yearly"]).optional(),
  limits: z.object({ maxInvoices: z.number().int().min(0).optional(), maxCustomers: z.number().int().min(0).optional(), maxExpenses: z.number().int().min(0).optional() }).optional()
});

export const planUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.string().regex(/^\d+(\.\d{1,4})?$/).optional(),
  billingInterval: z.enum(["monthly", "yearly"]).optional(),
  limits: z.object({ maxInvoices: z.number().int().min(0).optional(), maxCustomers: z.number().int().min(0).optional(), maxExpenses: z.number().int().min(0).optional() }).optional()
});


export interface NotificationType {
  planCreated: "plan_created";
  subscriptionActive: "subscription_active";
  subscriptionExpired: "subscription_expired";
  trialWarning: "trial_warning";
  invoicePaid: "invoice_paid";
  invoiceOverdue: "invoice_overdue";
}

export interface NotificationCreateInput {
  type: NotificationType[keyof NotificationType];
  recipientEmail: string;
  recipientName?: string;
  businessId?: string;
  planId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  context?: Record<string, any>;
}

export interface NotificationStatus {
  id: string;
  type: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export const notificationCreateSchema = z.object({
  type: z.enum(["plan_created", "subscription_active", "subscription_expired", "trial_warning", "invoice_paid", "invoice_overdue"]),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  businessId: z.string().uuid().optional(),
  planId: z.string().uuid().optional(),
  subscriptionId: z.string().uuid().optional(),
  invoiceId: z.string().uuid().optional(),
  context: z.record(z.any()).optional(),
});




