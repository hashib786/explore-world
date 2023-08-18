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

  const statsTotal = stats.length;

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: statsTotal ? stats[0].avgRating : 4.5,
    ratingsQuantity: statsTotal ? stats[0].nRating : 0,
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
reviewSchema.post("save", function (val, next) {
  // here i am not directly not calling calcAverageRating because this only access in model but this time model is not defined so i use hoisting funcion and explicitly defined this keyword
  calculatingAvgRating(this.tour);

  next();
});

// here i am writting regular expressions in findOne not find because whenever populating review calling find and every time calculate average call
reviewSchema.post(
  /^findOne/,
  function (
    this: mongoose.Query<any, any, {}, any, "find">,
    val: IReview,
    next
  ) {
    calculatingAvgRating(val.tour);
    next();
  }
);

const Review = mongoose.model<IReview, ReviewModel>("Review", reviewSchema);

// this is for calculating avrage rating
function calculatingAvgRating(tourId: Types.ObjectId) {
  Review.calcAverageRating(tourId);
}

export default Review;
