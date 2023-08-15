import mongoose from "mongoose";
import { IReview } from "../interfaces/reviewInterface";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    review: {
      type: String,
      required: [true, "A tour must have a review"],
    },
    rating: {
      type: Number,
      min: [1, "review is not less than 1"],
      max: [5, "review is not greater than 5"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "review is must belong to the tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review is must belong to the user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(
  /^find/,
  async function (this: mongoose.Query<any, any, {}, any, "find">, next) {
    this.populate({
      path: "tour",
      select: "name",
    }).populate({
      path: "user",
      select: "name photo",
    });

    next();
  }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
