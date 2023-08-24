import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  updateBooking,
} from "../controllers/bookingController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

router.route("/checkout-session/:tourId").get(protect, getCheckoutSession);

router.use(protect, restrictTo("admin, lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);
router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
