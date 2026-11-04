// @ts-nocheck
import { Router } from "express";
import { login, register } from "./auth.controller";
import { refresh } from "./auth.controller";
import { me } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);

export default router;
