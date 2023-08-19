import { Router } from "express";
import { getOverview, getTourView } from "../controllers/viewController";

const router = Router();

router.route("/").get(getOverview);
router.route("/tour/:slug").get(getTourView);

export default router;
