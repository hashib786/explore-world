import mongoose from "mongoose";

const URL = process.env.MONGO_URL!;

const connectFunc = (): void => {
  mongoose
    .connect(URL)
    .then(() => console.log("MongoDB connect"))
    .catch((error) => console.log("MongoDB error when connecting 🔥🔥", error));
};

export default connectFunc;
