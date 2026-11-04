import { prisma } from "@prisma/client";
import { NotFoundError, AppError } from "../../utils/errors";

export const findByBusinessId = async (id: string) => {
  return prisma.business.findUnique({ where: { id } });
};

export const findBusinessBySlug = async (slug: string) => {
  return prisma.business.findUnique({ where: { slug } });
};

export const listBusinessesForUser = async (userId: string) => {
  const memberships = await prisma.businessMember.findMany({
    where: { userId },
    select: { businessId: true, role: true },
  });
  const ids = memberships.map((m) => m.businessId);
  if (ids.length === 0) return [];
  return prisma.business.findMany({
    where: { id: { in: ids } },
    orderBy: { name: "asc" },
  });
};

export const assertBusinessExists = async (id: string) => {
  const business = await findByBusinessId(id);
  if (!business) {
    throw new NotFoundError("Business not found.");
  }
  return business;
};

export const createBusiness = async (data: {
  name: string;
  baseCurrency: string;
  timezone: string;
  locale: string;
  ownerId: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: data.name,
        baseCurrency: data.baseCurrency,
        timezone: data.timezone,
        locale: data.locale,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "business",
      },
    });

    await tx.businessMember.create({
      data: {
        businessId: business.id,
        userId: data.ownerId,
        role: "OWNER",
      },
    });

    return business;
  });
};

export const updateBusiness = async (id: string, data: { name?: string; baseCurrency?: string; timezone?: string; locale?: string }) => {
  return prisma.business.update({
    where: { id },
    data,
  });
};

export const listMembers = async (businessId: string) => {
  return prisma.businessMember.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
  });
};

export const findMemberByUserId = async (businessId: string, userId: string) => {
  return prisma.businessMember.findUnique({
    where: { businessId_userId: { businessId, userId } },
  });
};

export const createMember = async (data: { businessId: string; userId: string; role: string }) => {
  return prisma.businessMember.create({ data });
};

export const updateMemberRole = async (businessId: string, userId: string, role: string) => {
  return prisma.businessMember.update({
    where: { businessId_userId: { businessId, userId } },
    data: { role },
  });
};

export const assertMemberExists = async (businessId: string, userId: string) => {
  const member = await findMemberByUserId(businessId, userId);
  if (!member) {
    throw new AppError("Member not found in this business.", 404, "MEMBER_NOT_FOUND");
  }
  return member;
};
