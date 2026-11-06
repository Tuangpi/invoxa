// @ts-nocheck
import prisma from "@prisma/client";
import { NotFoundError, AppError } from "../../utils/errors";

export const findByBusinessIdAndId = async (businessId: string, id: string) => {
  return prisma.customer.findUnique({
    where: { businessId, id },
  });
};

export const listByBusinessId = async (businessId: string) => {
  return prisma.customer.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });
};

export const assertCustomerExists = async (businessId: string, id: string) => {
  const customer = await findByBusinessIdAndId(businessId, id);
  if (!customer) {
    throw NotFoundError("Customer not found.");
  }
  return customer;
};

export const createCustomer = async (data: {
  businessId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Record<string, any>;
}) => {
  return prisma.customer.create({
    data: {
      businessId: data.businessId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
};

export const updateCustomer = async (
  businessId: string,
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Record<string, any>;
  },
) => {
  return prisma.customer.update({
    where: { businessId, id },
    data,
  });
};

export const archiveCustomer = async (businessId: string, id: string) => {
  return prisma.customer.update({
    where: { businessId, id },
    data: { name: `__archived__` },
  });
};
