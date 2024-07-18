import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/dbConnnect.js";
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Error while connecting to database");
  });
