import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import AppError from "../utils/appError";
import User from "../models/userModel";
import { UserInRequest } from "../interfaces/util";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";
import multer, { FileFilterCallback } from "multer";

const filterObj = (obj: any, ...allowedField: string[]) => {
  const filterObject: any = {};
  Object.keys(obj).forEach((fieldName) => {
    if (allowedField.includes(fieldName))
      filterObject[fieldName] = obj[fieldName];
  });
  return filterObject;
};

const multerStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public/img/users");
  },
  filename(req: Request & UserInRequest, file, callback) {
    if (!req.user)
      callback(new AppError("You are not logged in", 403), "nothing");
    const extention = file.mimetype.split("/")[1];
    callback(null, `user-${req?.user?._id}-${Date.now()}.${extention}`);
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) callback(null, true);
  else callback(new AppError("Please upload only Image", 403));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPhoto = upload.single("photo");

export const deleteMe = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("User is not logged in", 403));
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({ status: "success", data: null });
  }
);

export const updateMe = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    console.log(req.body);
    console.log(req.file);
    if (!req.user) return next(new AppError("You are not logged in", 403));
    // 1. create error if user want to change password
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "This route is not for update password! for updating password use updatemypassword/ roures",
          400
        )
      );

    // 2. Update user documents
    const filterBody = filterObj(req.body, "name", "email");
    // here i using findByIdAndUpdate not save method because i am only updating non sensitive data
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", data: { updatedUser } });
  }
);

export const getMe = async (
  req: Request & UserInRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(new AppError("You are not logged in", 403));
  req.params.id = req.user._id.toString();
  next();
};

export const getUser = getOne(User);
export const getAllUser = getAll(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
