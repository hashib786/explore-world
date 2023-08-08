import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { join } from "path";
import { currentWorkingDirectory } from "../utils/utility";

import Tour from "../models/tourModel";

const tours: any[] = JSON.parse(
  fs.readFileSync(
    join(currentWorkingDirectory, "/dev-data/data/tours-simple.json"),
    "utf-8"
  )
);

export const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any
) => {
  const tour = tours.find((ele) => ele.id === +value);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  next();
};

export const getAllTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
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
      error: "Invalid data coming",
    });
  }
};

export const updateTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  res.status(201).json({
    status: "success",
    data: {
      tours,
    },
  });
};

export const deleteTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
