import express from "express";
import {
  checkBody,
  checkId,
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
} from "../controllers/tourController";

const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllTour).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
