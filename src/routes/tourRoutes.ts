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

const router = express.Router();

// router.param("id", checkId);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/top-5-tour").get(aliasTopTour, getAllTour);
router.route("/").get(getAllTour).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
