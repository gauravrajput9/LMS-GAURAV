import express from "express";
import CreateCourse, {
  editCourse,
  GetAllAdminCourses,
  getAllPublishedCourses,
  getPublishedCourses,
  getSearchedCourse,
  getSingleCourse,
} from "../controllers/course.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { upload } from "../utils/Multer.js";
import {
  createLecture,
  deleteLecture,
  editLecture,
  getCourseLectures,
  getEditingLecture,
  handlePublish,
} from "../controllers/lecture.controller.js";
import { getUserCourseProgress } from "../controllers/trackProgressController.controller.js";
const courseRouter = express.Router();

courseRouter
  .route("/create")
  .post(isAuthenticated, upload.single("courseImage"), CreateCourse);

courseRouter.route("/get-published").get(isAuthenticated, getPublishedCourses)

courseRouter.route("/fetch-courses").get(isAuthenticated, GetAllAdminCourses);

courseRouter.route("/get-single-course/:id").get(getSingleCourse);

courseRouter
  .route("/edit-course/:id")
  .put(isAuthenticated, upload.single("courseImage"), editCourse);

courseRouter.route("/:id/create-lecture").post(isAuthenticated, createLecture);

courseRouter
  .route("/:id/lecture")
  .get(isAuthenticated, getCourseLectures);

courseRouter
  .route("/:id/lecture/:lectureId")
  .post(isAuthenticated, upload.single("videoFile"), editLecture);


courseRouter
  .route("/:id/lecture/:lectureId")
  .get(isAuthenticated, getEditingLecture);

courseRouter.route("/:id/lecture/:lectureId").delete(isAuthenticated, deleteLecture)

courseRouter.route("/:id/publish").put(isAuthenticated, handlePublish)

courseRouter.route("/search-courses").get(isAuthenticated, getSearchedCourse)

courseRouter.route("/get-all-published-courses").get(isAuthenticated, getAllPublishedCourses)

courseRouter.route("/get-user-course-progress/course/:id")
  .get(isAuthenticated, getUserCourseProgress);




export default courseRouter;
