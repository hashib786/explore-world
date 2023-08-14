import { ObjectId } from "mongoose";
import IUser from "./userInterface";

export interface UserInRequest {
  user?: IUser;
}

export interface JWTReturn {
  id: ObjectId;
  iat: number;
  exp: number;
}

export interface mailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}
