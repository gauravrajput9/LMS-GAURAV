import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    throw err; // ensure the Promise rejects so .catch() gets triggered
  }
};
