import ErrorRequire from "../interfaces/ErrorRequired";

class AppError extends Error {
  public status?: string | undefined;
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

export default AppError;
