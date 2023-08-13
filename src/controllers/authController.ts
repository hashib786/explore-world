import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/cathAsync";
import User from "../models/userModel";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";
import AppError from "../utils/appError";
import { Types } from "mongoose";
import { promisify } from "util";
import { JWTReturn, UserInRequest } from "../interfaces/util";

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      passwordChangeAt: req.body.passwordChangeAt,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError("Please Provide email and Password", 400));

    // if you given in select only password without + then it only return password but if you add + then it add passwordif also written in shema is selected false
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.isCorrectPassword(password, user.password)))
      return next(new AppError("Please Provide write email or password", 401));

    const token = signToken(user._id);

    res.status(200).send({ status: "success", token });
  }
);

export const protect = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(
        new AppError("You are not logged in please login for get access ", 401)
      );

    const verifyJwt = promisify<string, Secret | GetPublicKeyOrSecret>(
      jwt.verify
    );

    // jwt.verify(token, process.env.JWT_SECRET!,"dfdfds", function (err, decode : JWTReturn){

    // })

    const decode: JWTReturn = (await verifyJwt(
      token,
      process.env.JWT_SECRET!
    )) as unknown as JWTReturn;

    const currentUser = await User.findById(decode.id);
    if (!currentUser)
      return new AppError("User blogging token is no longer exist", 401);

    const isPasswordChanged = currentUser.isPasswordChanged(decode.iat);

    if (isPasswordChanged)
      return next(
        new AppError("user recently changed password! Please log in again", 401)
      );

    req.user = currentUser;

    next();
  }
);
