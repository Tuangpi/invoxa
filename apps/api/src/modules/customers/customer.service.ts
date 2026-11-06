import { NotFoundError, ForbiddenError } from "../../utils/errors";
import {
  listByBusinessId,
  assertCustomerExists,
  createCustomer as createCustomerRepo,
  updateCustomer,
  archiveCustomer,
} from "./customer.repository";

export async function listCustomers(req: any, res: any) {
  try {
    const businessId = (req.query && typeof req.query.businessId === "string" ? req.query.businessId : (req.params && req.params.businessId));
    if (!businessId) {
      return res.status(403).json({ success: false, error: { message: "Missing businessId.", code: "MISSING_BUSINESS_ID" } });
    }
    const customers = await listByBusinessId(businessId);
    return res.json({ success: true, data: { customers } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getCustomer(req: any, res: any) {
  try {
    const customer = await assertCustomerExists(req.params.businessId, req.params.id);
    return res.json({ success: true, data: { customer } });
  } catch (err) {
    return res.status(404).json({ success: false, error: { message: "Customer not found.", code: "CUSTOMER_NOT_FOUND" } });
  }
}

export async function createCustomer(req: any, res: any) {
  try {
    const data = req.body;
    const customer = await createCustomerRepo({
      businessId: data.businessId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
    return res.status(201).json({ success: true, data: { customer } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function patchCustomer(req: any, res: any) {
  try {
    const customer = await assertCustomerExists(req.params.businessId, req.params.id);
    const data = req.body;
    const updated = await updateCustomer(req.params.businessId, req.params.id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
    return res.json({ success: true, data: { customer: updated } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteCustomer(req: any, res: any) {
  try {
    const customer = await assertCustomerExists(req.params.businessId, req.params.id);
    await archiveCustomer(req.params.businessId, req.params.id);
    return res.json({ success: true, data: { customer: customer } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}


