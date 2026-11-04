import { Request, Response } from "express";
import {
  loginUser,
  refreshAccessToken,
  getMe,
  registerUser,
  signAccessToken,
  signRefreshToken,
} from "./auth.service";
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
  const { id, name: userName, email: userEmail } = await registerUser({ name, email, password });
  const accessToken = signAccessToken({ id, email: userEmail, name: userName });
  const refreshToken = signRefreshToken({ id });
  sendResponse(res, 201, { user: { id, name: userName, email: userEmail }, accessToken, refreshToken });
}
