// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "../business/business.middleware";
import {
  listInvoicesHandler,
  getInvoiceHandler,
  createInvoiceHandler,
  updateInvoiceHandler,
  deleteInvoiceHandler,
} from "./invoice.controller";

const router = Router();

// Invoices are per-business, so require authentication and membership
router.use(requireAuth);

router.get("/:businessId", requireMembershipOrAdmin, listInvoicesHandler);
router.get("/:businessId/:invoiceId", requireMembershipOrAdmin, getInvoiceHandler);
router.post("/:businessId", requireMembershipOrAdmin, createInvoiceHandler);
router.patch("/:businessId/:invoiceId", requireMembershipOrAdmin, updateInvoiceHandler);
router.delete("/:businessId/:invoiceId", requireMembershipOrAdmin, deleteInvoiceHandler);

export default router;
export { router as invoicesRouter };