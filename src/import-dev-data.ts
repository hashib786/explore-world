import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./models/tourModel";
import User from "./models/userModel";
import Review from "./models/reviewModel";

dotenv.config();

const DB = process.env.MONGO_URL!;

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
