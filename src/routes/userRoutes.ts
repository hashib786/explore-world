import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUser,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signUp,
  updatePassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updatemypassword", protect, updatePassword);
router.patch("/updateme", protect, updateMe);
router.delete("/deleteme", protect, deleteMe);

router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
