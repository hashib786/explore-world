import mongoose, { Types } from "mongoose";
import slugify from "slugify";
import ITour from "../interfaces/tourInterface";

// All validation related things is written in validator section in mongoose
const TourSchema = new mongoose.Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
      cast: "{VALUE} is not a number",
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => parseFloat(val.toFixed(1)),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //  for validot accessing this you need to define type of this so first create interface
        // Note : This validator only runs creating time not updating time
        validator: function (this: ITour, val: number) {
          return val < this.price;
        },
        message: "Discount price {VALUE} should be below price",
        // message: props => `${props.value} is not a valid phone number!`
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        _id: Types.ObjectId,
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Add timestamps option here
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// TourSchema.index({ price: 1 });
TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ slug: 1 });
TourSchema.index({ startLocation: "2dsphere" });

/*
  A virtual property in Mongoose is a calculated field that doesn't store data in the database. It's defined on a schema, and your provided code example computes a virtual property called durationWeeks, which calculates the tour duration in weeks based on the existing duration field. This calculated value isn't stored but is available when you access tour.durationWeeks. 
  Note : this is not accesable when you query 
*/

TourSchema.virtual("durationWeeks").get(function () {
  if (typeof this.duration === "number") return (this.duration / 7).toFixed(2);
  return null;
});

TourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

/* **** middleware in Mongoose: ****

  **** Document middleware
    validate
    save
    remove
    updateOne
    deleteOne
    init (note: init hooks are synchronous)

  **** Query middleware
    count
    countDocuments
    deleteMany
    deleteOne
    estimatedDocumentCount
    find
    findOne
    findOneAndDelete
    findOneAndRemove
    findOneAndReplace
    findOneAndUpdate
    remove
    replaceOne
    update
    updateOne
    updateMany
    validate

  When Triggered: Before save, update, validate, or remove operations on documents.
  When Not Triggered: During bulk writes, direct DB operations, and inserting multiple documents simultaneously.
  Note : next() --> calling only next middleware not it stop saving documents in database, you can add any pre middlware like save, findOneAndDelete and many more you can find in suggestions
*/
TourSchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

// TourSchema.pre("save", async function (next) {
//   const userPromises = this.guides?.map(
//     async (id: any) => await User.findById(id)
//   );
//   const ArrayWala = await Promise.all(userPromises);
//   console.log(ArrayWala);

//   next();
// });

// i created this function because i want to excute this conde in two time for find and find one also
function myMiddleware(
  this: mongoose.Query<any, any, {}, any, "find">,
  next: Function
) {
  // this.find({ secretTour: { $ne: true } }).select("-description");
  this.find({ secretTour: { $ne: true } });
  next();
}

TourSchema.pre("find", function (next) {
  myMiddleware.call(this, next);
});
TourSchema.pre("findOne", function (next) {
  myMiddleware.call(this, next);
});

TourSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any, {}, any, "find">, next) {
    this.find().populate({
      path: "guides",
      select: "-__v -passwordChangeAt -createdAt -updatedAt",
    });
    next();
  }
);

// post middleware after all queries executed so i can't excute extra queries
TourSchema.post("find", function (val, next) {
  // console.log(val);
  next();
});

// *** Aggregation middleware ***
// if i write this.pipeline() --> then i got whenever i write in aggregation pipeline in array so filter out anything you can push any thing in array i need to filter out something in there so i push in front side
// TourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

// This is post middleware it calling same like pre middleware you also get value
TourSchema.post("save", function (val, next) {
  // console.log(val.isSelected("slug"));
  next();
});

// function myFunction(this: any) {
//   console.log(this.someProperty);
// }

// const myObject = {
//   someProperty: "Hello, world!"
// };

// const boundFunction = myFunction.bind(myObject);
// boundFunction(); // Outputs: Hello, world!

const Tour = mongoose.model<ITour>("Tour", TourSchema);
export default Tour;
