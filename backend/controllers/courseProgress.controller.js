import { CourseProgess } from "../models/courseProgress.models.js"
import { Course } from "../models/courses.models.js"

export const getCourseProgress = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        let courseProgress = await CourseProgess.findOne({ courseId: id, userId }).populate("courseId")
        const courseDetails = await Course.findById(id).populate("lectures")

        // if no course progress or course found, simply return the course Details
        if (!courseDetails) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }

        //if course progress found
        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress?.lectureProgress || [],
                completed: courseProgress?.completed || false,
            },
        });

    } catch (error) {
        console.log("Course Progress Error: ", error)
        return res.status(500).send("Error while Fetching the Course Progress")
    }
}

export const updateLectureProgress = async (req, res) => {
    try {
        const id = req.params.id
        const lectureId = req.params.lectureId
        const userId = req.user._id

        // find the course progress and if not found any previous create a new document
        let courseProgress = await CourseProgess.findOne({ courseId: id, userId })
        if (!courseProgress) {
            courseProgress = await CourseProgess.create({
                courseId: id,
                userId,
                completed: false,
                lectureProgress: []
            })
        }

        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId)

        // the lecture index will not be equal to -1 if any lecture progress already exists and update the status
        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true
        } else {
            // If not, push a new entry with viewed = true
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true
            });
        }

        // update the course completed status if all the lectures are viewed
        const course = await Course.findById(id)
        const courseLecturesLength = course.lectures.length

        const lectureProgressLength = courseProgress.lectureProgress.filter((lecture) => lecture.viewed).length

        if (lectureProgressLength === courseLecturesLength) {
            courseProgress.completed = true
        }
        await courseProgress.save()

        return res.status(200).send("Course Progress updated Successfully")
    } catch (error) {
        console.log("Update Course Progress Error: ", error)
        return res.status(500).send("Error While Updating the Course Progress")
    }
}

export const markAsCompleted = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        const course = await Course.findById(id); // ✅ get all lectures
        if (!course) {
            return res.status(404).send("Course not found");
        }

        const courseProgress = await CourseProgess.findOne({ courseId: id, userId });

        if (!courseProgress) {
            return res.status(404).send("Course Progress not found");
        }

        // ✅ Build lectureProgress from course lectures
        const updatedProgress = course.lectures.map((lecture) => ({
            lectureId: lecture._id.toString(),
            viewed: true,
        }));

        courseProgress.lectureProgress = updatedProgress;
        courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            message: "Course marked as completed",
            courseProgress,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Cannot Mark Course As Completed");
    }
};

export const markAsInCompleted = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user._id

        const courseProgress = await CourseProgess.findOne({ courseId: id, userId })
        if (!courseProgress) {
            return res.status(404).send("Course Progress not found")
        }
        courseProgress.lectureProgress.map((lecture) => lecture.viewed = false)
        courseProgress.completed = false
        await courseProgress.save()

        return res.status(200).send("Course marked as Incompleted")
    } catch (error) {
        console.log(error)
    }
}

export const markLectureIncomplete = async (req, res) => {
    try {
        const lectureId = req.params.lectureId
        const id = req.params.id
        const userId = req.user._id
        
        const courseProgress = await CourseProgess.findOne({ courseId: id, userId })
        if (!courseProgress) {
            return res.status(404).send("no progress found for this lecture")
        }

        const lecture = courseProgress.lectureProgress.find((lecture) => lecture.lectureId === lectureId)
        if (!lecture) {
            return res.status(404).send("No Progress found initially")
        }

        if (lecture.viewed === false) {
            return res.status(500).send("Lecture Already marked as incomplete")
        }

        lecture.viewed = false
        courseProgress.completed = false
        await courseProgress.save()

        return res.status(200).send("Lectur Marked As Incomplete")

    } catch (error) {
        console.log(error)
        return res.status(500).send("Unable to mark Lecture As incomplete")
    }
}