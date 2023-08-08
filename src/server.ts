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

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
