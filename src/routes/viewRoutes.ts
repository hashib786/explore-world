import { Router } from "express";
import {
  getLogin,
  getOverview,
  getTourView,
} from "../controllers/viewController";

const router = Router();

router.route("/").get(getOverview);
router.route("/tour/:slug").get(getTourView);
router.route("/login").get(getLogin);

export default router;
