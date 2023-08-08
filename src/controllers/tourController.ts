import { NextFunction, Request, Response } from "express";

import Tour from "../models/tourModel";

export const aliasTopTour = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTour = async (req: Request, res: Response) => {
  try {
    // 1. Filter
    let queryObj = { ...req.query };
    const excludeFeild = ["page", "sort", "limit", "fields"];
    excludeFeild.forEach((ele) => delete queryObj[ele]);

    // Advance query Replace Directly in query
    // localhost:3000/api/v1/tours?price[lte]=500 writing query like that replace to localhost:3000/api/v1/tours?price[$lte]=500
    // const queryOpra = ["lt", "lte", "gt", "gte"];
    // queryOpra.forEach((ele) => {
    //   queryStr = queryStr.replaceAll(ele, "$" + ele);
    // });
    let query = Tour.find(queryObj);

    // 2. Sort
    let { sort } = req.query;
    if (sort && typeof sort === "string") {
      sort = sort.replaceAll(",", " ");
      query = query.sort(sort);
    } else query = query.sort("-createdAt");

    // 2. Selecting Fields
    let { fields } = req.query;
    if (fields && typeof fields === "string") {
      fields = fields.replaceAll(",", " ");
      query = query.select(fields);
    } else query = query.select("-__v");

    // 3. Pagination
    let { page, limit } = req.query;
    const pageNum = typeof page === "string" ? parseInt(page) : 1;
    const limitNum = typeof limit === "string" ? parseInt(limit) : 100;
    const skip = (pageNum - 1) * limitNum;
    query = query.skip(skip).limit(limitNum);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page doesn't exist");
    }

    Tour.find({ difficulty: { $in: ["difficult", "medium"] } });
    // Excute the query
    const tours = await query;
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndDelete(id);
    console.log(tour);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error,
    });
  }
};
