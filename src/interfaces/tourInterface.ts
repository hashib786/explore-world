import { Types } from "mongoose";

type StartLocation = {
  type: string;
  coordinates: number[];
  address: string;
  description: string;
};

type Day = {
  _id: Types.ObjectId;
  day: number;
};

interface ITour {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  createdAt: Date;
  updatedAt: Date;
  startLocation: StartLocation;
  locations: (StartLocation & Day)[];
}

export default ITour;
