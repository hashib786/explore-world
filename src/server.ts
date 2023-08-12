// configure environment variables
import dotenv from "dotenv";
dotenv.config();

// Connecting DB
import DB from "./DB/connectionDB";
DB();

// import app
import app from "./app";

// Lisning port
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

// Unhandled errors
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection: 🔥🔥🔥 ", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
