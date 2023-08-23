import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import Tour from "../models/tourModel";
import { UserInRequest } from "../interfaces/util";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export const getCheckoutSession = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "link", "paypal"],
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour?.slug}`,
      customer_email: req?.user?.email,
      client_reference_id: req.params.tourId,
      // for new checkout --> https://stripe.com/docs/payments/checkout/migrating-prices?integration=server, https://dashboard.stripe.com/test/logs/req_sFm2HWxkqGwJg5?t=1692804797
      line_items: [],
      // line_items: [
      //   {
      //     name: `${tour?.name} Tour`,
      //     description: tour?.summary,
      //     images: ["https://avatars.githubusercontent.com/u/108208385?v=4"],
      //     amount: tour?.price || 0 * 100,
      //     currency: "usd",
      //     quantity: 1,
      //   } as any,
      // ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  }
);
