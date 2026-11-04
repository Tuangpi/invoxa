import { Request, Response } from "express";
import {
  listBusinesses,
  getBusiness,
  create,
  patchBusiness,
  listMembersController,
  addMember,
  updateMember,
} from "./business.service";

export async function listBusinessesHandler(req: Request, res: Response) {
  await listBusinesses(req, res, (_err: Error) => {});
}

export async function getBusinessHandler(req: Request, res: Response) {
  await getBusiness(req, res, (_err: Error) => {});
}

export async function createHandler(req: Request, res: Response) {
  await create(req, res, (_err: Error) => {});
}

export async function patchBusinessHandler(req: Request, res: Response) {
  await patchBusiness(req, res, (_err: Error) => {});
}

export async function listMembersHandler(req: Request, res: Response) {
  await listMembersController(req, res, (_err: Error) => {});
}

export async function addMemberHandler(req: Request, res: Response) {
  await addMember(req, res, (_err: Error) => {});
}

export async function updateMemberHandler(req: Request, res: Response) {
  await updateMember(req, res, (_err: Error) => {});
}
