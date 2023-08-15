import { Router } from "express";
import { createReview, getAllReview } from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

// this is for doing when tour dynamic route call so it transfer here and merge that
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReview)
  .post(protect, restrictTo("user"), createReview);

export default router;
