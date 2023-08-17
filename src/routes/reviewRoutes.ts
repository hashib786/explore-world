import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getReview,
  setBody,
  updateReview,
} from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

// this is for doing when tour dynamic route call so it transfer here and merge that
const router = Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(getAllReview)
  .post(restrictTo("user"), setBody, createReview);

router
  .route("/:id")
  .delete(deleteReview)
  .patch(restrictTo("user", "guide"), updateReview)
  .get(getReview);

export default router;
