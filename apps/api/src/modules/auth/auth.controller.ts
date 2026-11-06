import { Request, Response, NextFunction } from "express";
import {
  loginUser,
  refreshAccessToken,
  getMe,
  registerUser,
  signAccessToken,
  signRefreshToken,
} from "./auth.service";
import { sendResponse } from "../../utils/response";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);
    sendResponse(res, 200, { user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken } = await refreshAccessToken(req.body.refreshToken);
    sendResponse(res, 200, { accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getMe(req.user!.id);
    sendResponse(res, 200, { user });
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const { id, name: userName, email: userEmail } = await registerUser({ name, email, password });
    const accessToken = signAccessToken({ id, email: userEmail, name: userName });
    const refreshToken = signRefreshToken({ id });
    sendResponse(res, 201, { user: { id, name: userName, email: userEmail }, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}


