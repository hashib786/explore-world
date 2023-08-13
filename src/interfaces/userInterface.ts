// Define an interface for the user document
interface IUser {
  name: string;
  email: string;
  photo?: string;
  password: string;
  confirmPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordChangeAt: Date;
  role: string;
  isCorrectPassword(
    candidatePassword: string,
    hashUserPassword: string
  ): Promise<boolean>;
  isPasswordChanged(JWTTimestamp: number): boolean;
}

export default IUser;
