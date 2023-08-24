import mongoose from "mongoose";
import { IBooking } from "../interfaces/bookingInterface";

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "booking is must belong to the tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "booking is must belong to the user"],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: [true, "booking is must have price"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any, {}, any, "find">, next) {
    this.populate("tour").populate({
      path: "user",
      select: "name",
    });

    next();
  }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
