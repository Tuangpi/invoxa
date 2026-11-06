import { ForbiddenError, ConflictError } from "../../utils/errors";
import { createPlan, getPlansByBusiness, getPlanById, updatePlan, deletePlan } from "./plan.repository";

export async function createPlanService(businessId: string, data: { name: string; price: string; billingInterval?: "monthly" | "yearly"; limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; } }, user: { id: string; role: string }) {
  // Only owners and admins can create plans
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw ForbiddenError("Only owners and admins can create plans.");
  }

  // Validate plan name is not empty
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Plan name is required.");
  }

  // Validate price is a valid decimal string
  if (!/^\d+(\.\d{1,4})?$/.test(data.price)) {
    throw new Error("Price must be a valid decimal number (max 4 decimal places).");
  }

  const plan = await createPlan(businessId, data);
  return { success: true, data: { plan } };
}

export async function getPlansService(businessId: string) {
  const plans = await getPlansByBusiness(businessId);
  return { success: true, data: { plans } };
}

export async function getPlanService(planId: string, businessId: string, user: { id: string; role: string }) {
  // Check if user has access to this business
  const plan = await getPlanById(planId, businessId);
  if (!plan) {
    throw new Error("Plan not found or does not belong to this business.");
  }
  return { success: true, data: { plan } };
}

export async function updatePlanService(planId: string, businessId: string, data: { name?: string; price?: string; billingInterval?: "monthly" | "yearly"; limits?: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number; } }, user: { id: string; role: string }) {
  // Only owners and admins can update plans
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw ForbiddenError("Only owners and admins can update plans.");
  }

  const plan = await getPlanById(planId, businessId);
  if (!plan) {
    throw new Error("Plan not found or does not belong to this business.");
  }

  // Validate price if provided
  if (data.price && !/^\d+(\.\d{1,4})?$/.test(data.price)) {
    throw new Error("Price must be a valid decimal number (max 4 decimal places).");
  }

  const updated = await updatePlan(planId, businessId, data);
  return { success: true, data: { plan: updated } };
}

export async function deletePlanService(planId: string, businessId: string, user: { id: string; role: string }) {
  // Only owners can delete plans
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can delete plans.");
  }

  const plan = await getPlanById(planId, businessId);
  if (!plan) {
    throw new Error("Plan not found.");
  }

  await deletePlan(planId, businessId);
  return { success: true, data: {} };
}