// @ts-nocheck
import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "./customer.middleware";
import {
  listCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  patchCustomerHandler,
  deleteCustomerHandler,
} from "./customer.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listCustomersHandler);
router.post("/", createCustomerHandler);

router.get("/:id", requireMembershipOrAdmin, getCustomerHandler);
router.patch("/:id", requireMembershipOrAdmin, patchCustomerHandler);
router.delete("/:id", requireMembershipOrAdmin, deleteCustomerHandler);

export default router;
export { router as customersRouter };


