import { Router } from "express";
import {
  getAccount,
  getLogin,
  getOverview,
  getTourView,
} from "../controllers/viewController";
import { isLoggedIn, protect } from "../controllers/authController";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(isLoggedIn, getOverview);
router.route("/tour/:slug").get(isLoggedIn, getTourView);
router.route("/login").get(isLoggedIn, getLogin);
router.route("/me").get(protect, getAccount);

export default router;
