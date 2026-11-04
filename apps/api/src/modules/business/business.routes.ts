import { Router } from "express";
import {
  listBusinessesHandler,
  getBusinessHandler,
  createHandler,
  patchBusinessHandler,
  listMembersHandler,
  addMemberHandler,
  updateMemberHandler,
} from "./business.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireMembershipOrAdmin } from "./business.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", listBusinessesHandler);
router.post("/", createHandler);

router.get("/:businessId", getBusinessHandler);
router.patch("/:businessId", patchBusinessHandler);

router.get("/:businessId/members", listMembersHandler);
router.post("/:businessId/members", addMemberHandler);
router.patch("/:businessId/members/:memberId", updateMemberHandler);

export default router;
