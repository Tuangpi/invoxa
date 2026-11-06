import { getBusinessAnalytics, getBusinessMembers, getAllBusinessSubscriptions, updatePlanLimits } from "./admin.repository";
import { ForbiddenError } from "../../utils/errors";

export async function adminGetAnalyticsService(
  businessId: string,
  user: { id: string; role: string }
) {
  // Only owners can view admin analytics
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can access admin analytics.");
  }

  const analytics = await getBusinessAnalytics(businessId);
  return analytics;
}

export async function adminGetMembersService(
  businessId: string,
  user: { id: string; role: string }
) {
  // Only owners and admins can view members
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw ForbiddenError("Only owners and admins can view business members.");
  }

  const members = await getBusinessMembers(businessId);
  return members;
}

export async function adminGetSubscriptionsService(
  businessId: string,
  user: { id: string; role: string }
) {
  // Only owners can view all subscriptions
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can view all subscriptions.");
  }

  const subscriptions = await getAllBusinessSubscriptions(businessId);
  return subscriptions;
}

export async function adminUpdatePlanLimitsService(
  planId: string,
  businessId: string,
  data: { maxInvoices?: number; maxCustomers?: number; maxExpenses?: number },
  user: { id: string; role: string }
) {
  // Only owners can update plan limits
  if (user.role !== "OWNER") {
    throw ForbiddenError("Only the owner can update plan limits.");
  }

  const result = await updatePlanLimits(planId, businessId, data);
  return result;
}