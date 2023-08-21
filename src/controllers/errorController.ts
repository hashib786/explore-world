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

const handleValidationErrorDb = (err: AppError & dublicateDBI) =>
  new AppError(err.message, 400);

const handleJWTtokenError = () =>
  new AppError("Invailid token please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your Token was expired! please login", 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  // A) API Error
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // B) Render Error
  res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // A) API Error
  if (req.originalUrl.startsWith("/api")) {
    // This Error is opration so i defined the error
    if (err.isOprational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      //  This Error is Programing so i don't want to send in client side
    }
    console.log("Programming Error 🔥🔥🔥", err);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  // A) Render Error
  if (err.isOprational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

const errorController = (
  err: AppError & pathVal & dublicateDBI,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, req, res);
  else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastDbError(err);
    if (err?.code === 11000) error = handleDublicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDb(err);
    if (err.name === "JsonWebTokenError") error = handleJWTtokenError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default errorController;
