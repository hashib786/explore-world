import { Request, Response } from "express";

export const getOverview = (req: Request, res: Response) => {
  res.status(200).render("overview", {
    tittle: "This is overview Page",
  });
};

export const getTourView = (req: Request, res: Response) => {
  res.status(200).render("tour", {
    tittle: "The Forest Hiker Details",
  });
};
