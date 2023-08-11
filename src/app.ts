import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import { currentWorkingDirectory } from "./utils/utility";
import { join } from "path";
import errorController from "./controllers/errorController";
import unhandledRoute from "./controllers/404route";

const app = express();

// Middlware
app.use(express.json());
process.env.NODE_ENV === "development" && app.use(morgan("dev"));
app.use(express.static(join(currentWorkingDirectory, "public")));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhadled Routes
app.all("*", unhandledRoute);
app.use(errorController);

export default app;
