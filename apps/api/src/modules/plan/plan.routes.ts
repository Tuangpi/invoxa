// @ts-nocheck
import { Router } from "express";
import {
  createPlanService,
  getPlansService,
  getPlanService,
  updatePlanService,
  deletePlanService,
} from "./plan.controller";

const router = Router();

// All routes require authentication
router.use(requireAuth as any);

// GET /plans - list plans for a business
router.get("/", async (req: any, res: any) => {
  const businessId = req.params.businessId || req.user?.membership?.businessId;
  if (!businessId) {
    return res.status(400).json({ success: false, error: "Missing businessId" });
  }
  const result = await getPlansService(businessId);
  res.json({ success: result.success, data: result.data });
});

// GET /plans/:id - get plan details
router.get("/:id", async (req: any, res: any) => {
  const businessId = req.params.businessId || req.user?.membership?.businessId;
  if (!businessId) {
    return res.status(400).json({ success: false, error: "Missing businessId" });
  }
  const result = await getPlanService(req.params.id, businessId, req.user);
  res.json({ success: result.success, data: result.data });
});

// POST /plans - create a new plan (owner/admin only)
router.post("/", requireOwnerOrAdmin, async (req: any, res: any) => {
  const businessId = req.params.businessId || req.user?.membership?.businessId;
  if (!businessId) {
    return res.status(400).json({ success: false, error: "Missing businessId" });
  }
  const result = await createPlanService(businessId, req.body, req.user);
  if (result.success) {
    res.status(201).json({ success: true, data: result.data });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// PATCH /plans/:id - update plan
router.patch("/:id", requireOwnerOrAdmin, async (req: any, res: any) => {
  const businessId = req.params.businessId || req.user?.membership?.businessId;
  if (!businessId) {
    return res.status(400).json({ success: false, error: "Missing businessId" });
  }
  const result = await updatePlanService(req.params.id, businessId, req.body, req.user);
  if (result.success) {
    res.json({ success: true, data: result.data });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// DELETE /plans/:id - delete plan
router.delete("/:id", requireOwner, async (req: any, res: any) => {
  const businessId = req.params.businessId || req.user?.membership?.businessId;
  if (!businessId) {
    return res.status(400).json({ success: false, error: "Missing businessId" });
  }
  const result = await deletePlanService(req.params.id, businessId, req.user);
  if (result.success) {
    res.json({ success: true, data: result.data });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

export default router;