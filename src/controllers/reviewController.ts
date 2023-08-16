import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Review from "../models/reviewModel";
import { UserInRequest } from "../interfaces/util";
import { createOne, deleteOne, getOne, updateOne } from "./handlerFactory";

export const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: { reviews },
    });
  }
);

export const setBody = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    // This is for creating review from tour routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user?._id;

    next();
  }
);

export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
