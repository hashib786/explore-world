import fs from "fs";
import express, { Request, Response } from "express";
import { join } from "path";

const app = express();
const currentWorkingDirectory = process.cwd();
app.use(express.json());

// app.get("/", (req: Request, res: Response) => {
//   //   res.status(200).send("Hello World");
//   res.status(404).json({ message: "Hello World" });
// });

// Read Json File
const tours: any[] = JSON.parse(
  fs.readFileSync(
    join(currentWorkingDirectory, "/dev-data/data/tours-simple.json"),
    "utf-8"
  )
);

app.get("/api/v1/tours", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req: Request, res: Response) => {
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
});

app.post("/api/v1/tours", (req: Request, res: Response) => {
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
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});