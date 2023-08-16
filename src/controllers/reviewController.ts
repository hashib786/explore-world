import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Review from "../models/reviewModel";
import { UserInRequest } from "../interfaces/util";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const setBody = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    // This is for creating review from tour routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user?._id;

    next();
  }
);

export const getAllReview = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
