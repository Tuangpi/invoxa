import { Request, Response } from "express";
import { loginUser, refreshAccessToken, getMe } from "./auth.service";
import { sendResponse } from "../../utils/response";

export async function login(req: Request, res: Response) {
  const { user, accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);
  sendResponse(res, 200, { user, accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response) {
  const { accessToken, refreshToken } = await refreshAccessToken(req.body.refreshToken);
  sendResponse(res, 200, { accessToken, refreshToken });
}

export async function me(req: Request, res: Response) {
  const user = await getMe(req.user!.id);
  sendResponse(res, 200, { user });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await registerUser(email, password);
  sendResponse(res, 201, { user, accessToken, refreshToken });
}


export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await registerUser(email, password);
  sendResponse(res, 201, { user, accessToken, refreshToken });
}
