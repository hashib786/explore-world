import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import { currentWorkingDirectory } from "./utils/utility";
import { join } from "path";
import errorController from "./controllers/errorController";
import unhandledRoute from "./controllers/404route";

const app = express();

// This is for how many requests one IP address can request
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from the IP, please try again in one hour",
});

app.use("/api", limiter);

// Middlware
app.use(express.json());
process.env.NODE_ENV === "development" && app.use(morgan("dev"));
app.use(express.static(join(currentWorkingDirectory, "public")));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhadled Routes
app.all("*", unhandledRoute);

// handle globel error handling
app.use(errorController);

export default app;
