import { ObjectId } from "mongoose";
import IUser from "./userInterface";
import { Multer } from "multer";

export interface UserInRequest {
  user?: IUser;
}

// export interface imageInRequest {
//   files?: {
//     [fieldname: string]: Multer.File[];
// } | Multer.File[] | undefined;
// }

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
