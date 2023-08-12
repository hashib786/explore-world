import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

interface pathVal {
  path?: string;
  value?: string;
}

const handleCastDbError = (err: AppError & pathVal) => {
  const message = `Invalid ${err?.path} ${err?.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // This Error is opration so i defined the error
  if (err.isOprational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //  This Error is Programing so i don't want to send in client side
  } else {
    console.log("Programming Error 🔥🔥🔥", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const errorController = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  else {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastDbError(err);
    sendErrorProd(error, res);
  }
};

export default errorController;
