import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  //   res.status(200).send("Hello World");
  res.status(404).json({ message: "Hello World" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
