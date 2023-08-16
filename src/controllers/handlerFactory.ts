import { Request, Response, NextFunction } from "express";
import mongoose, { Document, Types } from "mongoose";
import catchAsync from "../utils/cathAsync";
import AppError from "../utils/appError";
import { PopulateOptions } from "mongoose";
import APIfeature from "../utils/APIfeature";

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

export const createOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data,
      },
    });
  });

export const getOne = <T>(
  Model: BaseModel<T>,
  populateOption?: PopulateOptions
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) query.populate(populateOption);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No documents found with that id : " + id, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = <T>(Model: BaseModel<T>) => {
  return catchAsync(async (req: Request, res: Response) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = new APIfeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .feilds()
      .pagination();

    // Excute the query
    const docs = await feature.query;
    res.status(200).json({
      status: "success",
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });
};
