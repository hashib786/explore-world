import { Types } from "mongoose";

export interface IBooking {
  tour: Types.ObjectId;
  user: Types.ObjectId;
  price: Number;
  paid: Boolean;
}
