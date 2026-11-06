// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "../business/business.middleware";
import {
  createSubscriptionService,
  getSubscriptionsService,
  getSubscriptionService,
  updateSubscriptionService,
  cancelSubscriptionService,
  endTrialService,
} from "./subscription.service";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Subscription routes are per-business, so require membership
router.use(requireMembershipOrAdmin);

// POST /subscriptions - create a new subscription (trial starts)
router.post(
  "/",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await createSubscriptionService(businessId, {
        planId: req.body.planId,
        user: req.user,
      });
      if (result.success) {
        res.status(201).json({ success: true, data: result.data });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// GET /subscriptions - list subscriptions for a business
router.get(
  "/",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await getSubscriptionsService(businessId);
    res.json({ success: result.success, data: result.data });
  }
);

// GET /subscriptions/:id - get subscription details
router.get(
  "/:id",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await getSubscriptionService(req.params.id, businessId, req.user);
    res.json({ success: result.success, data: result.data });
  }
);

// PATCH /subscriptions/:id - update subscription status
router.patch(
  "/:id",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await updateSubscriptionService(req.params.id, businessId, {
        status: req.body.status,
      }, req.user);
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

// POST /subscriptions/:id/cancel - cancel subscription
router.post(
  "/:id/cancel",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await cancelSubscriptionService(req.params.id, businessId, req.user);
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

// POST /subscriptions/:id/end-trial - end trial and start active
router.post(
  "/:id/end-trial",
  async (req: any, res: any) => {
    const businessId = req.params.businessId || req.user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    try {
      const result = await endTrialService(req.params.id, businessId, req.user);
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