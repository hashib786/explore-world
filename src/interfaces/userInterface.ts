// Define an interface for the user document
interface IUser {
  name: string;
  email: string;
  photo?: string;
  password: string;
  confirmPassword?: string;
  isCorrectPassword(
    candidatePassword: string,
    hashUserPassword: string
  ): Promise<boolean>;
}

export default IUser;
