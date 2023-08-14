import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet"; // The helmet package for Node.js adds vital security-related HTTP headers to your application automatically, fortifying it against prevalent web vulnerabilities.

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import { currentWorkingDirectory } from "./utils/utility";
import { join } from "path";
import errorController from "./controllers/errorController";
import unhandledRoute from "./controllers/404route";

const app = express();

// Apply helmet middleware for enhanced security
app.use(helmet());

// Apply rate limiting middleware for IP-based request limits
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from the IP, please try again in one hour",
});
app.use("/api", limiter);

// Middleware for parsing JSON data and setting a size limit
app.use(express.json({ limit: "10kb" }));

// Middleware for logging requests in development mode
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

// Middleware to serve static files from the "public" directory
app.use(express.static(join(currentWorkingDirectory, "public")));

// Routes for tours and users
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhandled Routes
app.all("*", unhandledRoute);

// Global error handling middleware
app.use(errorController);

export default app;
