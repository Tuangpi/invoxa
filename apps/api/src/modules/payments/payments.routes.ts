// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "../business/business.middleware";
import {
  listPaymentsHandler,
  getPaymentHandler,
  createPaymentHandler,
  reversePaymentHandler,
} from "./payments.controller";

const router = Router();

// All payment routes require authentication and business membership
router.use(requireAuth);

// Payment routes are per-business, so require membership
router.use(requireMembershipOrAdmin);

router.get("/", listPaymentsHandler);
router.get("/:paymentId", getPaymentHandler);
router.post("/", createPaymentHandler);
router.post("/:paymentId/reverse", reversePaymentHandler);

export default router;
export { router as paymentsRouter };