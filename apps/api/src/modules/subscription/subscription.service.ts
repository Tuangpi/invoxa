import { createSubscription, getSubscriptionsByBusiness, getSubscriptionById, updateSubscription, cancelSubscription, endTrialSubscription } from "./subscription.repository";
import { createPlan, getPlansByBusiness, getPlanById } from "../plan/plan.repository";
import { ForbiddenError, ConflictError } from "../../utils/errors";

// Type for plan limits extracted from JSON
type PlanLimits = {
  maxInvoices?: number;
  maxCustomers?: number;
  maxExpenses?: number;
};

export async function createSubscriptionService(
  businessId: string,
  data: {
    planId: string;
    user: { id: string; role: string };
  }
) {
  const { user } = data;
  // Check if user has access to this business
  const plan = await getPlanById(data.planId, businessId);
  if (!plan) {
    throw new Error("Plan not found or does not belong to this business.");
  }

  // Check if user has role to create subscription (owner/admin)
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw ForbiddenError("Only owners and admins can create subscriptions.");
  }

  // **Enforce plan limits** - check if creating a new subscription would exceed plan limits
  const currentSubscriptions = await getSubscriptionsByBusiness(businessId);

  // Count active + trialing + past_due subscriptions (exclude canceled)
  const activeSubscriptions = currentSubscriptions.filter(
    (sub: any) => sub.status !== "CANCELED"
  ).length;

  // Extract limits from plan (limits is stored as Json? in Prisma, so we need to cast/parse it)
  const planLimits: PlanLimits = plan.limits as unknown as PlanLimits;

  // Check maxInvoices limit
  if (planLimits.maxInvoices && activeSubscriptions >= planLimits.maxInvoices) {
    throw ConflictError(
      `Cannot create subscription: maximum of ${planLimits.maxInvoices} invoices/subscriptions reached for this plan.`
    );
  }

  // Check maxCustomers limit (count unique businesses with active subscriptions)
  // Each subscription is for one business, so we count the number of subscriptions
  if (planLimits.maxCustomers && activeSubscriptions >= planLimits.maxCustomers) {
    throw ConflictError(
      `Cannot create subscription: maximum of ${planLimits.maxCustomers} customers/subscriptions reached for this plan.`
    );
  }

  // Check maxExpenses limit - this would typically be enforced at the expense recording level,
  // but we can check if the number of expenses would exceed the limit.
  // For now, we'll check based on subscription count as a proxy, or skip if not set.
  if (planLimits.maxExpenses && activeSubscriptions >= planLimits.maxExpenses) {
    throw ConflictError(
      `Cannot create subscription: maximum of ${planLimits.maxExpenses} expenses/subscriptions reached for this plan.`
    );
  }

  // Create the subscription starting in trial period
  const currentPeriodStart = new Date().toISOString();
  const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30-day trial

  const subscription = await createSubscription(businessId, {
    planId: data.planId,
    status: "TRIALING",
    currentPeriodStart,
    currentPeriodEnd,
  });

  return { success: true, data: { subscription } };
}

export async function getSubscriptionsService(businessId: string) {
  const subscriptions = await getSubscriptionsByBusiness(businessId);
  return { success: true, data: { subscriptions } };
}

export async function getSubscriptionService(
  subscriptionId: string,
  businessId: string,
  user: { id: string; role: string }
) {
  const subscription = await getSubscriptionById(subscriptionId, businessId);
  if (!subscription) {
    throw new Error("Subscription not found.");
  }
  return { success: true, data: { subscription } };
}

export async function updateSubscriptionService(
  subscriptionId: string,
  businessId: string,
  data: { status?: string },
  user: { id: string; role: string }
) {
  // Only owners and admins can update subscriptions
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw ForbiddenError("Only owners and admins can update subscriptions.");
  }

  const subscription = await updateSubscription(subscriptionId, businessId, data);
  return { success: true, data: { subscription } };
}

export async function cancelSubscriptionService(
  subscriptionId: string,
  businessId: string,
  user: { id: string; role: string }
) {
  // Only owners can cancel subscriptions
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can cancel subscriptions.");
  }

  const subscription = await cancelSubscription(subscriptionId, businessId);

  return { success: true, data: { subscription } };
}

export async function endTrialService(
  subscriptionId: string,
  businessId: string,
  user: { id: string; role: string }
) {
  // Only owners can end trial
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can end trial.");
  }

  const subscription = await endTrialSubscription(subscriptionId, businessId);
  return { success: true, data: { subscription } };
}