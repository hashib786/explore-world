import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Document, Types } from "mongoose";
import catchAsync from "../utils/cathAsync";
import AppError from "../utils/appError";

interface IBaseDocument extends Document {
  _id: Types.ObjectId;
}

type BaseModel<T> = mongoose.Model<
  T,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, T> & T & IBaseDocument,
  any
>;

export const deleteOne = <T>(Model: BaseModel<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const doc = await Model.findByIdAndDelete(new Types.ObjectId(id));

      if (!doc) {
        return next(new AppError(`No document found with id: ${id}`, 404));
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  });
};

export const updateOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data)
      return next(new AppError("No document found with that id : " + id, 404));

    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });
