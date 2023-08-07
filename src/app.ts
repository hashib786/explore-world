import fs from "fs";
import express, { Request, Response } from "express";
import { join } from "path";
import morgan from "morgan";

const app = express();

// Middlware
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(morgan("dev"));

const currentWorkingDirectory = process.cwd();

// Routes
// Read Json File

const tours: any[] = JSON.parse(
  fs.readFileSync(
    join(currentWorkingDirectory, "/dev-data/data/tours-simple.json"),
    "utf-8"
  )
);

const getAllTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req: Request, res: Response) => {
  const newTour = { id: Date.now(), ...req.body };
  tours.push(newTour);

  fs.writeFile(
    join(currentWorkingDirectory, "/dev-data/data/tours-simple.json"),
    JSON.stringify(tours),
    (err) => {
      console.log("Creting file i got error: " + err);
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      newTour,
    },
  });
};

const updateTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  if (!tour)
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  res.status(201).json({
    status: "success",
    data: {
      tours,
    },
  });
};

const deleteTour = (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = tours.find((ele) => ele.id === +id);
  if (!tour)
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
const createUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
const getUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
const updateUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};
const deleteUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined." });
};

app.route("/api/v1/tours").get(getAllTour).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUser).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Lisning port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
