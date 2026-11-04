import { z } from "zod";

const base = {
  name: z.string().trim().min(1, "Name is required"),
  baseCurrency: z.string().length(3, "Currency must be a 3-letter ISO code"),
  timezone: z.string().optional(),
  locale: z.string().default("en"),
};

export const businessSchemas = {
  create: z.object({
    ...base,
    members: z.array(
      z.object({
        userId: z.string().uuid("Invalid user ID"),
        role: z.enum(["OWNER", "ADMIN", "STAFF", "VIEWER"]),
      }),
    ).default([]),
  }),
  patch: z.object({
    name: z.string().trim().min(1).optional(),
    baseCurrency: z.string().length(3).optional(),
    timezone: z.string().optional(),
    locale: z.string().optional(),
  }),
  memberPatch: z.object({
    role: z.enum(["OWNER", "ADMIN", "STAFF", "VIEWER"]),
  }),
};

export type CreateBusinessInput = z.infer<typeof businessSchemas.create>;
export type PatchBusinessInput = z.infer<typeof businessSchemas.patch>;
export type PatchMemberInput = z.infer<typeof businessSchemas.memberPatch>;
