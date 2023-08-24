import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Tour from "../models/tourModel";
import { UserInRequest } from "../interfaces/util";
import Stripe from "stripe";
import AppError from "../utils/appError";
import Booking from "../models/bookingModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export const getCheckoutSession = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour)
      return next(
        new AppError("Please provide write tour id for checkout", 401)
      );

    const session = await stripe.checkout.sessions.create({
      // in method only include which one is shown on your dashboard setting if you want to integrate upi then you need to cantact with customere care in stripe
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/?tour=${
        req.params.tourId
      }&user=${req.user?._id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req?.user?.email,
      client_reference_id: req.params.tourId,
      // for new checkout --> https://stripe.com/docs/payments/checkout/migrating-prices?integration=server, https://dashboard.stripe.com/test/logs/req_sFm2HWxkqGwJg5?t=1692804797
      line_items: [
        {
          price_data: {
            // for india --> inr
            currency: "usd",
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: ["https://avatars.githubusercontent.com/u/108208385?v=4"],
            },
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  }
);

export const createBookingCheckout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split("?")[0]);
  }
);

export const getAllBooking = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    const booking = await Booking.find({ user: req.user?._id });
    const tourIds = booking.map((ele) => ele.tour);

    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render("overview", {
      tittle: "My Tours",
      tours,
    });
  }
);
