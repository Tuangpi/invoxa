import { ForbiddenError } from "../../utils/errors";
import { ConflictError } from "../../utils/errors";
import { createBusiness, listBusinessesForUser, listMembers, assertBusinessExists, createMember, updateBusiness, findMemberByUserId, updateMemberRole, assertMemberExists } from "./business.repository";


export async function listBusinesses(req: any, res: any, next: any) {
  try {
    const businesses = await listBusinessesForUser(req.user!.id);
    res.json({ success: true, data: { businesses } });
  } catch (err) {
    next(err);
  }
}

export async function getBusiness(req: any, res: any, next: any) {
  try {
    const business = await assertBusinessExists(req.params.businessId);
    res.json({ success: true, data: { business } });
  } catch (err) {
    next(err);
  }
}

export async function create(req: any, res: any, next: any) {
  try {
    const data = req.body;
    const business = await createBusiness({
      name: data.name,
      baseCurrency: data.baseCurrency,
      timezone: data.timezone || "UTC",
      locale: data.locale || "en",
      ownerId: req.user!.id,
    });
    res.status(201).json({ success: true, data: { business } });
  } catch (err) {
    next(err);
  }
}

export async function patchBusiness(req: any, res: any, next: any) {
  try {
    const business = await assertBusinessExists(req.params.businessId);
    const data = req.body;
    const updated = await updateBusiness(business.id, {
      name: data.name,
      baseCurrency: data.baseCurrency,
      timezone: data.timezone,
      locale: data.locale,
    });
    res.json({ success: true, data: { business: updated } });
  } catch (err) {
    next(err);
  }
}

export async function listMembersController(req: any, res: any, next: any) {
  try {
    const members = await listMembers(req.params.businessId);
    res.json({ success: true, data: { members } });
  } catch (err) {
    next(err);
  }
}

export async function addMember(req: any, res: any, next: any) {
  try {
    const { userId, role } = req.body;
    const business = await assertBusinessExists(req.params.businessId);

    if (req.membership!.role !== "OWNER" && req.membership!.role !== "ADMIN") {
      throw new ForbiddenError("Only owners and admins can invite members.");
    }

    const existing = await findMemberByUserId(req.params.businessId, userId);
    if (existing) {
      throw new ConflictError("User is already a member of this business.");
    }

    const member = await createMember({ businessId: business.id, userId, role });
    res.status(201).json({ success: true, data: { member } });
  } catch (err) {
    next(err);
  }
}

export async function updateMember(req: any, res: any, next: any) {
  try {
    const { role } = req.body;
    await assertMemberExists(req.params.businessId, req.params.memberId);

    if (req.membership!.role !== "OWNER" && req.membership!.role !== "ADMIN") {
      throw new ForbiddenError("Only owners and admins can change member roles.");
    }

    const member = await updateMemberRole(req.params.businessId, req.params.memberId, role);
    res.json({ success: true, data: { member } });
  } catch (err) {
    next(err);
  }
}
