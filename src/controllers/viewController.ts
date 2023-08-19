import { Request, Response } from "express";
import Tour from "../models/tourModel";

export const getOverview = (req: Request, res: Response) => {
  const tours = Tour.find();
  res.status(200).render("overview", {
    tittle: "This is overview Page",
    tours,
  });
};

export const getTourView = (req: Request, res: Response) => {
  res.status(200).render("tour", {
    tittle: "The Forest Hiker Details",
  });
};
