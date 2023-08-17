import express from "express";
import {
  aliasTopTour,
  createTour,
  deleteTour,
  getAllTour,
  getMonthlyPlan,
  getTour,
  getTourStats,
  updateTour,
} from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";
import reviewRoutes from "./reviewRoutes";

const router = express.Router();

// router.param("id", checkId);

router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("lead-guide", "admin", "guide"), getMonthlyPlan);
router.route("/top-5-tour").get(aliasTopTour, getAllTour);

router
  .route("/")
  .get(getAllTour)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("lead-guide", "admin"), updateTour)
  .delete(protect, restrictTo("lead-guide", "admin"), deleteTour);

// here written this things so avoid repeated code
router.use("/:tourId/reviews", reviewRoutes);

export default router;
