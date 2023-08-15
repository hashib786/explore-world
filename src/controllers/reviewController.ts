import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Review from "../models/reviewModel";
import { UserInRequest } from "../interfaces/util";

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
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    // This is for creating review from tour routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user?._id;

    const review = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: { review },
    });
  }
);
