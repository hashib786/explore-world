import mongoose, { Types } from "mongoose";

export interface IReview {
  review: string;
  rating: number;
  tour: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
