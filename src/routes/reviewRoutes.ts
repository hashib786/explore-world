import { Router } from "express";
import { createReview, getAllReview } from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

router
  .route("/")
  .get(getAllReview)
  .post(protect, restrictTo("user"), createReview);

export default router;
