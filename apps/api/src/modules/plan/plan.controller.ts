import { Request, Response } from "express";
import {
  createPlanService,
  getPlansService,
  getPlanService,
  updatePlanService,
  deletePlanService,
} from "./plan.service";

export async function listPlansHandler(req: Request, res: Response) {
  try {
    const businessId = (req as any).params.businessId || (req as any).user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await getPlansService(businessId);
    res.json({ success: result.success, data: result.data });
  } catch (err) {
    console.error("listPlans error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getPlanHandler(req: Request, res: Response) {
  try {
    const businessId = (req as any).params.businessId || (req as any).user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await getPlanService(req.params.id, businessId, (req as any).user);
    res.json({ success: result.success, data: result.data });
  } catch (err) {
    console.error("getPlan error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function createPlanHandler(req: Request, res: Response) {
  try {
    const businessId = (req as any).params.businessId || (req as any).user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await createPlanService(businessId, req.body, (req as any).user);
    res.status(201).json({ success: result.success, data: result.data });
  } catch (err) {
    console.error("createPlan error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function updatePlanHandler(req: Request, res: Response) {
  try {
    const businessId = (req as any).params.businessId || (req as any).user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await updatePlanService(req.params.id, businessId, req.body, (req as any).user);
    res.json({ success: result.success, data: result.data });
  } catch (err) {
    console.error("updatePlan error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function deletePlanHandler(req: Request, res: Response) {
  try {
    const businessId = (req as any).params.businessId || (req as any).user?.membership?.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const result = await deletePlanService(req.params.id, businessId, (req as any).user);
    res.json({ success: result.success, data: result.data });
  } catch (err) {
    console.error("deletePlan error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}