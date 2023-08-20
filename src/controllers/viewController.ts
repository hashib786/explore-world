import { NextFunction, Request, Response } from "express";
import Tour from "../models/tourModel";
import catchAsync from "../utils/cathAsync";

export const getOverview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();
    res.status(200).render("overview", {
      tittle: "This is overview Page",
      tours,
    });
  }
);

export const getTourView = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug }).populate({
      path: "reviews",
      select: "name photo review rating",
    });

    res
      .status(200)
      .set(
        "Content-Security-Policy",
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      )
      .render("tour", {
        tittle: `${tour?.name} Tour`,
        tour,
      });
  }
);
