import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URI}/e-commerce`
    );
    console.log(`MONGO DB CONNECT || DB_HOST ${connect.connection.host}`);
  } catch (error) {
    console.log("mongoDb connecttion error", error);
    process.exit(1);
  }
};

export default connectDB;
