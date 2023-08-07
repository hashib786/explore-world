import express, { NextFunction, Request, Response } from "express";
import {
  checkId,
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
} from "../controllers/tourController";

const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllTour).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
