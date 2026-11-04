import type { Request as ExpressRequest } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
}