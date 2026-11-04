import express from "express";
import authRouter from "./modules/auth/auth.routes";
import businessRouter from "./modules/business/business.routes";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/businesses", businessRouter);
