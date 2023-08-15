import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Review from "../models/reviewModel";

export const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      data: { reviews },
    });
  }
);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: { review },
    });
  }
);
