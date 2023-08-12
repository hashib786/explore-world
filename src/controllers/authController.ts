import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import User from "../models/userModel";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  }
);
