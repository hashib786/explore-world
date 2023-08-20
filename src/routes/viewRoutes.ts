import { Router } from "express";
import {
  getLogin,
  getOverview,
  getTourView,
} from "../controllers/viewController";
import { protect } from "../controllers/authController";

const router = Router();

router.route("/").get(getOverview);
router.route("/tour/:slug").get(protect, getTourView);
router.route("/login").get(getLogin);

export default router;
