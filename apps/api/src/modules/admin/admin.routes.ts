// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "../business/business.middleware";
import {
  adminGetAnalyticsService,
  adminGetMembersService,
  adminGetSubscriptionsService,
  adminUpdatePlanLimitsService,
} from "./admin.service";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Admin routes require business membership
router.use(requireMembershipOrAdmin);

// GET /admin/analytics - business revenue and analytics (owner only)
router.get(
  "/analytics",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await adminGetAnalyticsService(businessId, req.user);
      if (result.success) {
        res.json({ success: true, data: result.data });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// GET /admin/members - list business members (owner/admin)
router.get(
  "/members",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await adminGetMembersService(businessId, req.user);
      if (result.success) {
        res.json({ success: true, data: result.data });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// GET /admin/subscriptions - list all subscriptions (owner only)
router.get(
  "/subscriptions",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await adminGetSubscriptionsService(businessId, req.user);
      if (result.success) {
        res.json({ success: true, data: result.data });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /admin/plan-limits - update plan limits (owner only)
router.put(
  "/plan-limits",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const { planId, maxInvoices, maxCustomers, maxExpenses } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, error: "Missing planId" });
    }
    try {
      const result = await adminUpdatePlanLimitsService(
        planId,
        businessId,
        { maxInvoices, maxCustomers, maxExpenses },
        req.user
      );
      if (result.success) {
        res.json({ success: true, data: result.data });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default router;