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
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/top-5-tour").get(aliasTopTour, getAllTour);
router.route("/").get(protect, getAllTour).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("lead-guide", "admin"), deleteTour);

// here written this things so avoid repeated code
router.use("/:tourId/reviews", reviewRoutes);

// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

export default router;
