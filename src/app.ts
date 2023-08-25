import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet"; // The helmet package for Node.js adds vital security-related HTTP headers to your application automatically, fortifying it against prevalent web vulnerabilities.
import mongoSantize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from "cors";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import reviewRouter from "./routes/reviewRoutes";
import viewRouter from "./routes/viewRoutes";
import bookingRouter from "./routes/bookingRoutes";
import { currentWorkingDirectory } from "./utils/utility";
import { join } from "path";
import errorController from "./controllers/errorController";
import unhandledRoute from "./controllers/404route";
import compression from "compression";
import { webhookCheckout } from "./controllers/bookingController";

console.log("Environment --->", process.env.NODE_ENV);

const app = express();

// app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", join(currentWorkingDirectory, "views"));

app.use(cors());

// Global Middleware
// Middleware to serve static files from the "public" directory
app.use(express.static(join(currentWorkingDirectory, "public")));

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Apply helmet middleware for enhanced security
app.use(helmet());

// for text compression
app.use(compression());

// Apply rate limiting middleware for IP-based request limits
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from the IP, please try again in one hour",
});
app.use("/api", limiter);

// Middleware for parsing JSON data and setting a size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization againts NoSql query injection
app.use(mongoSantize());
// Date sanitization againts XSS

// Middleware for logging requests in development mode
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

// Test Middleware
// app.use((req, res, next) => {
//   next();
// });

// Routes for tours , users, reviews
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

// Unhandled Routes
app.all("*", unhandledRoute);

// Global error handling middleware
app.use(errorController);

export default app;
