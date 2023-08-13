import { ObjectId } from "mongoose";

export interface UserInRequest {
  user?: Object;
}

export interface JWTReturn {
  id: ObjectId;
  iat: number;
  exp: number;
}
