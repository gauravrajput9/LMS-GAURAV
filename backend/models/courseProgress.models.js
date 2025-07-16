import mongoose from "mongoose";

const LectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: String,
    },
    viewed: {
        type: Boolean
    }
})

const CourseProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    courseId: {
        type: String
    },
    completed: {
        type: Boolean
    },
    lectureProgress: [LectureProgressSchema]
})

export const LectureProgress = mongoose.model("LectureProgress", LectureProgressSchema)
export const CourseProgess = mongoose.model("CourseProgress", CourseProgressSchema)