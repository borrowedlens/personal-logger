import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { z } from "zod";

export enum ErrorStatusCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export class GlobalError extends Error {
  statusCode: ErrorStatusCodes;
  constructor(message: string, statusCode: ErrorStatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || ErrorStatusCodes.INTERNAL_SERVER_ERROR,
    errorMessage = err.message || "Something went wrong";
  if (err instanceof z.ZodError || err instanceof SyntaxError) {
    statusCode = ErrorStatusCodes.BAD_REQUEST;
    errorMessage = "There were errors parsing the request";
  }
  res.status(statusCode).json({
    errorCode: statusCode,
    errorMessage: errorMessage,
    success: false,
    data: null,
  });
};
