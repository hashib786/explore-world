import dotenv from "dotenv";
dotenv.config();
import app from "./app";

// Lisning port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
