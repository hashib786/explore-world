import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import { currentWorkingDirectory } from "./utils/utility";
import { join } from "path";
import ErrorRequire from "./interfaces/ErrorRequired";
import AppError from "./utils/appError";

const app = express();

// Middlware
app.use(express.json());
process.env.NODE_ENV === "development" && app.use(morgan("dev"));
app.use(express.static(join(currentWorkingDirectory, "public")));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhadled Routes
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(function (
  err: ErrorRequire,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
