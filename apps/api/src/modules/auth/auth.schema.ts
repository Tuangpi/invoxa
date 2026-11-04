import { z } from "zod";

export const authSchemas = {
  register: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  login: z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  refresh: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
  me: z.object({}),
};

export type AuthInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthLoginInput = {
  email: string;
  password: string;
};

export type AuthRefreshInput = {
  refreshToken: string;
};
