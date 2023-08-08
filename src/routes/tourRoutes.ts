import express from "express";
import {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
} from "../controllers/tourController";
import Tour from "../models/tourModel";

const router = express.Router();

// router.param("id", checkId);

router
  .route("/")
  .get(getAllTour)
  .post(createTour)
  .delete(async (req, res, next) => {
    await Tour.deleteMany();
    res.status(204).json({
      status: "success",
    });
  });
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
