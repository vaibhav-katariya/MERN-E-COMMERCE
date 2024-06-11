import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/dbConnnect.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Error connecting to database");
  });
