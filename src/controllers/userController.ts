import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import AppError from "../utils/appError";
import User from "../models/userModel";
import { UserInRequest } from "../interfaces/util";
import { deleteOne } from "./handlerFactory";

const filterObj = (obj: any, ...allowedField: string[]) => {
  const filterObject: any = {};
  Object.keys(obj).forEach((fieldName) => {
    if (allowedField.includes(fieldName))
      filterObject[fieldName] = obj[fieldName];
  });
  return filterObject;
};

export const deleteMe = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("User is not logged in", 403));
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({ status: "success", data: null });
  }
);

export const updateMe = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
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

export const getAllUser = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(500).json({ status: "success", data: { users } });
};
export const createUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
export const getUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
export const updateUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
export const deleteUser = deleteOne(User);
