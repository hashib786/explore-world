import { Router } from "express";
import { getCheckoutSession } from "../controllers/bookingController";

const router = Router();

router.route("/checkout-session/:tourId").get(getCheckoutSession);

export default router;
