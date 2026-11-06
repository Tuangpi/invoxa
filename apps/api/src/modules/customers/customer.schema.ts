import { z } from "zod";

const base = {
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z.string().optional(),
  address: z.record(z.any()).optional(),
};

export const customerSchemas = {
  create: z.object({
    ...base,
    businessId: z.string().uuid("Invalid business ID"),
  }),
  patch: z.object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().optional(),
    address: z.record(z.any()).optional(),
  }),
};

export type CreateCustomerInput = z.infer<typeof customerSchemas.create>;
export type PatchCustomerInput = z.infer<typeof customerSchemas.patch>;
