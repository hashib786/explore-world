import { Types } from "mongoose";

// Define an interface for the user document
interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  password: string;
  confirmPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordChangeAt: Date | Number;
  role: string;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  isCorrectPassword(
    candidatePassword: string,
    hashUserPassword: string
  ): Promise<boolean>;
  isPasswordChanged(JWTTimestamp: number): boolean;
  createPasswordResetToken(): String;
}

export default IUser;
