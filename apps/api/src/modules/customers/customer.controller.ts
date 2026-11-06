import { Request, Response } from "express";
import {
  listCustomers,
  getCustomer,
  createCustomer,
  patchCustomer,
  deleteCustomer,
} from "./customer.service";

export async function listCustomersHandler(req: Request, res: Response) {
  await listCustomers(req, res);
}

export async function getCustomerHandler(req: Request, res: Response) {
  await getCustomer(req, res);
}

export async function createCustomerHandler(req: Request, res: Response) {
  await createCustomer(req, res);
}

export async function patchCustomerHandler(req: Request, res: Response) {
  await patchCustomer(req, res);
}

export async function deleteCustomerHandler(req: Request, res: Response) {
  await deleteCustomer(req, res);
}
