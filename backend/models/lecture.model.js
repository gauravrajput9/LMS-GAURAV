import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    publicId: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false, // false = not free by default
    },
    duration: {
      type: String,
    },
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      // required: true,
    },
    publicId: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
