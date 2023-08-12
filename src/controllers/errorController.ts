import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

interface pathVal {
  path?: string;
  value?: string;
}
interface dublicateDBI {
  code?: number;
  keyValue?: {
    name?: string;
  };
}

const handleCastDbError = (err: AppError & pathVal) => {
  const message = `Invalid ${err?.path} ${err?.value}`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err: AppError & dublicateDBI) => {
  const message = `Duplicate field value : (${err?.keyValue?.name}) please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err: AppError & dublicateDBI) => {
  return new AppError(err.message, 400);
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
  err: AppError & pathVal & dublicateDBI,
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
    if (err?.code === 11000) error = handleDublicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDb(err);

    sendErrorProd(error, res);
  }
};

export default errorController;
