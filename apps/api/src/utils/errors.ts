export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const NotFoundError = (message = "Resource not found") =>
  new AppError(message, 404);

export const BadRequestError = (message = "Bad request") =>
  new AppError(message, 400);

export const UnauthorizedError = (message = "Unauthorized") =>
  new AppError(message, 401);

export const ForbiddenError = (message = "Forbidden") =>
  new AppError(message, 403);

export const ConflictError = (message = "Conflict") =>
  new AppError(message, 409);

export const UnprocessableEntityError = (message = "Unprocessable entity") =>
  new AppError(message, 422);
