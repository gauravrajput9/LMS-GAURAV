import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.routes.js";
import purchaseRouter from "./routes/purchaseCourse.routes.js";
import courseProgressRouter from "./routes/courseProgress.routes.js";

dotenv.config();

const app = express();

// ⚠️ Must be BEFORE express.json()
app.use("/purchase/webhook", express.raw({ type: "application/json" }));

const allowedOrigins = [
  "http://localhost:5173", // or your Vite dev server port
  "https://lms-gaurav.netlify.app"
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/purchase", purchaseRouter);
app.use("/courseProgress", courseProgressRouter)

const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ Database connected successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
