import { Router } from "express";
import { getCheckoutSession } from "../controllers/bookingController";
import { protect } from "../controllers/authController";

const router = Router();

router.route("/checkout-session/:tourId").get(protect, getCheckoutSession);

export default router;
