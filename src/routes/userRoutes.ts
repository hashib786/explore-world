import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUser,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController";
import {
  forgotPassword,
  logOut,
  login,
  protect,
  resetPassword,
  restrictTo,
  signUp,
  updatePassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logOut);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

router.use(protect);
router.patch("/updatemypassword", updatePassword);
router.patch("/updateme", updateMe);
router.delete("/deleteme", deleteMe);
router.get("/me", getMe, getUser);

router.use(restrictTo("admin"));
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
