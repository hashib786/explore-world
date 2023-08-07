import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";

const app = express();

// Middlware
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(morgan("dev"));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

export default app;
