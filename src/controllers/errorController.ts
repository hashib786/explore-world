import { NextFunction, Request, Response } from "express";
import ErrorRequire from "../interfaces/ErrorRequired";

const errorController = (
  err: ErrorRequire,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorController;
