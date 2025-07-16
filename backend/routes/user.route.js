import express from "express";
import {
  editUser,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { upload } from "../utils/Multer.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/getUser").get(isAuthenticated, getUser);
userRouter.route("/logout").get(isAuthenticated, logoutUser);
userRouter
  .route("/edit-user")
  .post(isAuthenticated, upload.single("profilePhoto"), editUser);

export default userRouter;
