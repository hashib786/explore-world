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
import AppError from "../utils/appError";
import multer, { FileFilterCallback } from "multer";
import { Multer } from "multer"; // Make sure to import the appropriate Multer type
import sharp from "sharp";

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

//  saving image file in buffer so i cropt images
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) callback(null, true);
  else callback(new AppError("Please upload only Image", 403));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload.single('image') req.file
// upload.array('images', 5) req.files
export const uploadTourImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const resizeTourImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next();
    if (!("images" in req.files) || !("imageCover" in req.files)) return next();
    const imagesArray = req.files.images as Express.Multer.File[];
    const imagesCoverArray = req.files.imageCover as Express.Multer.File[];

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(imagesCoverArray[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];

    await Promise.all(
      imagesArray.map(async (ele, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(ele.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      })
    );

    next();
  }
);

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

// /tour-within/:distance/center/:latlng/unit/:unit
export const getTourWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const radius = unit === "mi" ? +distance / 3963.2 : +distance / 6378.1;

    if (!lat || !lng)
      return next(
        new AppError(
          "please provide latitude and langitude in the format lat,lng.",
          400
        )
      );

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res.status(200).json({ status: "success", results: tours.length, tours });
  }
);

export const getDistance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if (!lat || !lng)
      return next(
        new AppError(
          "please provide latitude and langitude in the format lat,lng.",
          400
        )
      );

    const distance = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [+lng, +lat],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({ status: "success", distance });
  }
);
