import { NextFunction, Request, Response } from "express";

import Tour from "../models/tourModel";
import catchAsync from "../utils/cathAsync";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const aliasTopTour = (
  req: Request,
  _: any, // @ts-ignore
  next: NextFunction
) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTour = getAll(Tour);
export const getTour = getOne(Tour, { path: "reviews" });
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await Tour.aggregate([
    // in match you can filter and then you can do anything
    // { $match: { price: { $gte: 1000 } } },
    // grouping given functionality so whichone you filtered you perfomed some action in grouping
    {
      $group: {
        // _id give you sepration like here all group seprated by difficulty --> easy, medium, difficult
        // $toUpper --> convert to uppercase string
        _id: { $toUpper: "$difficulty" },
        // $sum --> for counting anythng like eg : 1 --> added only one
        // $sum --> for counting $ratingsQuantity field and that value
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        // $avg --> this is for avarage
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        // $min --> finding minimum
        minPrice: { $min: "$price" },
        // $max --> finding maximum
        maxPrice: { $max: "$price" },
      },
    },
    {
      // $sort --> after grouping it basically sort avgPrice(this is defined in grouping) --> 1 mean assending 0 mean descending
      $sort: { avgPrice: 1 },
    },
    // you can add another filter also like $match
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response) => {
    const year: number = +req.params.year;
    const plan = await Tour.aggregate([
      {
        // $unwind --> this unwind basically it spread array like in one document have array [1, 2, 3] so
        // unwind seprate in seprate num like 1, 2 etc.
        $unwind: "$startDates",
      },
      {
        // $match --> here after of unwinding there added filtering
        $match: {
          startDates: {
            // $gte --> gte is also working in date so here select date is gte given year and lte also doing like that
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          // $push --> basically grouping time push for return array
          tours: { $push: "$name" },
        },
      },
      {
        // $addFields --> basically add after groping another field like there copy id value in month and return
        $addFields: { month: "$_id" },
      },
      {
        // $project --> in project if i give _id --> 0 so it hide returning time
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        // $limit --> limit basically give you only given number value
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  }
);
