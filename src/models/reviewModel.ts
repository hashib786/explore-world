import mongoose, { Model, Types } from "mongoose";
import { IReview } from "../interfaces/reviewInterface";
import Tour from "./tourModel";

interface ReviewModel extends Model<IReview> {
  calcAverageRating(tourId: Types.ObjectId): void;
}

const reviewSchema = new mongoose.Schema<IReview, ReviewModel>(
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

// Here i created static function for that you need to create one interface and extend model in mongoose and defined in interface
// this static funtion only run direct model
reviewSchema.static("calcAverageRating", async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
});

reviewSchema.pre(
  /^find/,
  async function (this: mongoose.Query<any, any, {}, any, "find">, next) {
    this.populate({
      path: "user",
      select: "name photo",
    });

    next();
  }
);

// here i am calling written post middleware because after saving i want to calculate avrage rating of tour (calcAverageRating)
reviewSchema.post("save", function () {
  // here i am not directly not calling calcAverageRating because this only access in model but this time model is not defined so i use hoisting funcion and explicitly defined this keyword
  calculatingAvgRating.call(this);
});

const Review = mongoose.model<IReview, ReviewModel>("Review", reviewSchema);

// this is for calculating avrage rating
function calculatingAvgRating(
  this: mongoose.Document<unknown, {}, IReview> &
    IReview & {
      _id: mongoose.Types.ObjectId;
    }
) {
  Review.calcAverageRating(this.tour);
}

export default Review;
