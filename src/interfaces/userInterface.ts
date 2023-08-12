// Define an interface for the user document
interface IUser {
  name: string;
  email: string;
  photo?: string;
  password: string;
  confirmPassword?: string;
}

export default IUser;
