import { Router } from "express";
import {
  getAccount,
  getLogin,
  getOverview,
  getTourView,
  updateUserBody,
} from "../controllers/viewController";
import { isLoggedIn, protect } from "../controllers/authController";
import { getUserAllBooking } from "../controllers/bookingController";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(isLoggedIn, getOverview);
router.route("/tour/:slug").get(isLoggedIn, getTourView);
router.route("/login").get(isLoggedIn, getLogin);
router.route("/me").get(protect, getAccount);
router.route("/my-tours").get(protect, getUserAllBooking);

router.route("/submit-user-data").post(protect, updateUserBody);

export default router;
