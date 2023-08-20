import { Router } from "express";
import {
  getLogin,
  getOverview,
  getTourView,
} from "../controllers/viewController";
import { isLoggedIn } from "../controllers/authController";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(getOverview);
router.route("/tour/:slug").get(getTourView);
router.route("/login").get(getLogin);

export default router;
