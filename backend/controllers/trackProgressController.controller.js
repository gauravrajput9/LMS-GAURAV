import { Course } from "../models/courses.models.js";
import { CourseProgess } from "../models/courseProgress.models.js"

export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ message: "Course not found" });

    const courseProgress = await CourseProgess.findOne({ userId, courseId }).lean();

    const totalLectures = course.lectures.length;
    const completed = courseProgress?.lecturesProgress?.filter((l) => l.viewed).length || 0;

    const progress = totalLectures > 0 ? Math.round((completed / totalLectures) * 100) : 0;

    res.json({
      courseId,
      progress,
      completedLectures: completed,
      totalLectures,
    });
  } catch (error) {
    console.log("User Course Progress Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
