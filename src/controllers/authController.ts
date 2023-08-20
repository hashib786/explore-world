import { CookieOptions, NextFunction, Request, Response } from "express";
import crypto from "crypto";
import catchAsync from "../utils/cathAsync";
import User from "../models/userModel";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";
import AppError from "../utils/appError";
import { Types } from "mongoose";
import { promisify } from "util";
import { JWTReturn, UserInRequest } from "../interfaces/util";
import sendMail from "../utils/email";
import IUser from "../interfaces/userInterface";

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: IUser, status: number, res: Response) => {
  const token = signToken(user._id);

  const cookieOption: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * (24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);
  user.password = "";

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
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
      role: req.body.role,
    });

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res);
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
    } else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError("You are not logged in please login for get access ", 401)
      );

    const verifyJwt = promisify<string, Secret | GetPublicKeyOrSecret>(
      jwt.verify
    );

    const decode: JWTReturn = (await verifyJwt(
      token,
      process.env.JWT_SECRET!
    )) as unknown as JWTReturn;

    const currentUser = await User.findById(decode.id);
    if (!currentUser)
      return next(new AppError("User blogging token is no longer exist", 401));

    const isPasswordChanged = currentUser.isPasswordChanged(decode.iat);

    if (isPasswordChanged)
      return next(
        new AppError("user recently changed password! Please log in again", 401)
      );

    req.user = currentUser;

    next();
  }
);

export const restrictTo = (...role: string[]) => {
  return (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    if (!role.includes(req?.user?.role || "nothing"))
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(new AppError("There is no user with this emailID", 404));

    const resetToken = user.createPasswordResetToken();

    // here i am save because createPasswordResetToken there i want to store token and expires date
    // here i also written validateBeforeSave: false because in saving time i only save some information not password and many thing like that so if i don't write thing then i got error
    await user.save({ validateBeforeSave: false });

    // create reset Url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetpassword/${resetToken}`;
    const message = "Reset Your password";
    const html = `
              <style>
                .reset-link {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <a class="reset-link" href="${resetUrl}">Reset Password</a>
              <p>If you didn't request this reset, you can ignore this email.</p>
  `;

    try {
      await sendMail({
        email: user.email,
        subject: message,
        message,
        html,
      });

      res.status(200).json({
        status: "success",
        message: "Token send on you email",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("Error when sending email! Please try again later.", 500)
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // if token has not expired then set the new password
    if (!user) return next(new AppError("Token is invalid or expired", 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request & UserInRequest, res: Response, next: NextFunction) => {
    // 1. Get User from collection
    const user = await User.findById(req?.user?._id).select("+password");
    if (!user) return next(new AppError("You cannot perform this action", 403));

    // 2. check if posted old password is currect
    const isCorrect = await user.isCorrectPassword(
      req.body.oldPassword,
      user.password
    );
    if (!isCorrect)
      return next(new AppError("Please provide write old password", 403));

    // 3. if yes then update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 4. login user and send jwt
    createSendToken(user, 200, res);
  }
);
