import mongoose from "mongoose";

const TourSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "A tour must have name"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have price"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model("Tour", TourSchema);
export default Tour;
