import { Response } from "express";

export type ResponseData<T> = T extends undefined ? never : T;

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
): Response => {
  res.status(statusCode).json({ success: true, data });
  return res.status(statusCode).json({ success: true, data });
};

export const sendNoContent = (res: Response): void => {
  res.status(204).end();
};
