import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js"
import { getCourseProgress, markAsCompleted, markAsInCompleted, markLectureIncomplete, updateLectureProgress } from "../controllers/courseProgress.controller.js"

const courseProgressRouter = express.Router()

courseProgressRouter.route("/:id").get(isAuthenticated, getCourseProgress)
courseProgressRouter.route("/:id/lecture/:lectureId").post(isAuthenticated, updateLectureProgress)
courseProgressRouter.route("/:id/complete").post(isAuthenticated, markAsCompleted)
courseProgressRouter.route("/:id/incomplete").post(isAuthenticated, markAsInCompleted)
courseProgressRouter.route("/:id/lecture/:lectureId/incomplete").post(isAuthenticated, markLectureIncomplete)

export default courseProgressRouter
